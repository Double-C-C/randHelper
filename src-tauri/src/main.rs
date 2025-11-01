// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::engine::general_purpose;
use base64::Engine;
use image::io::Reader;
use rand::{seq::SliceRandom, Rng};
use std::collections::hash_map::Entry;
use std::fmt::format;
use std::fs::File;
use std::io::{BufReader, Cursor};
use std::{fs, path::Path};
use tauri::command;
use tauri::Manager;

#[tauri::command]
fn generate_random(min: i32, max: i32) -> Result<i32, String> {
    if min > max {
        return Err("最小值不能大于最大值哥们".into());
    }
    let mut rng = rand::thread_rng();
    Ok(rng.gen_range(min..=max))
}

#[command]
fn pick_random_file(dir: String, exts: String) -> Result<String, String> {
    let p = Path::new(&dir);
    if !p.is_dir() {
        return Err("指定路径不是文件夹!".into());
    }

    if exts.is_empty() {
        return Err("你还没有输入扩展名!".into());
    }

    let want_exts: Vec<String> = exts
        .split(',')
        .map(|s| s.trim().trim_start_matches('.').to_lowercase())
        .filter(|s| !s.is_empty())
        .collect();

    if want_exts.is_empty() {
        return Err("没有识别到合法扩展名,请检查输入!".into());
    }

    let mut files = Vec::new();
    for entry in fs::read_dir(p).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let fp = entry.path();

        if fp.is_file() {
            if let Some(my_ext) = fp.extension().and_then(|e| e.to_str()) {
                if want_exts.contains(&my_ext.to_lowercase()) {
                    files.push(fp.to_string_lossy().to_string());
                }
            }
        }
    }

    if files.is_empty() {
        return Err(format!("未在该目录下找到以下格式的文件 : {}", exts));
    }

    let mut rng = rand::thread_rng();
    Ok(files.choose(&mut rng).ok_or("随机选择失败")?.to_string())
}

#[command]
fn generate_thumbnail(path: String, max_width: u32, max_height: u32) -> Result<String, String> {
    let p = Path::new(&path);
    let file = File::open(p).map_err(|e| e.to_string())?;
    let reader = BufReader::new(file);

    let format = image::ImageFormat::from_path(p).map_err(|e| e.to_string())?;
    let img = image::load(reader, format).map_err(|e| e.to_string())?;

    let thumb = img.thumbnail(max_width, max_height);

    let mut buf = Cursor::new(Vec::<u8>::new());

    thumb
        .write_to(&mut buf, image::ImageFormat::Png)
        .map_err(|e| e.to_string())?;

    let png_bytes = buf.into_inner();

    let b64 = general_purpose::STANDARD.encode(png_bytes);
    let data_url = format!("data:image/png;base64,{}", b64);

    Ok(data_url)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            generate_random,
            pick_random_file,
            generate_thumbnail
        ])
        .run(tauri::generate_context!())
        .expect("启动tauri项目时发生错误")
}
