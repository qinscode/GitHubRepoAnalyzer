#![cfg_attr(
    all(not(debug_assertions), target_os = "macos"),
    windows_subsystem = "macos"
)]

use tauri::Manager;

#[cfg(target_os = "macos")]
use cocoa::appkit::{NSWindow, NSWindowTitleVisibility};
#[cfg(target_os = "macos")]
use objc::runtime::YES;
#[cfg(target_os = "macos")]
use std::os::raw::c_void;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(target_os = "macos")]
      unsafe {
        if let Some(window) = app.get_webview_window("main") {
          let ns_window = window.ns_window().unwrap() as *mut c_void as *mut objc::runtime::Object;

          // 设置标题栏为透明，保留红黄绿按钮
          ns_window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
          ns_window.setTitlebarAppearsTransparent_(YES);
        }
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri app");
}