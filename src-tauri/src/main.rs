// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rand::Rng;
use tauri::Manager;

#[tauri::command]
fn generate_random(min: i32, max: i32) -> Result<i32, String> {
    if min > max {
        return Err("最小值不能大于最大值哥们".into());
    }
    let mut rng = rand::thread_rng();
    Ok(rng.gen_range(min..=max))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_random])
        .run(tauri::generate_context!())
        .expect("启动tauri项目时发生错误")
}
