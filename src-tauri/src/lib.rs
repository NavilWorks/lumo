//! Lumo backend.
//!
//! Milestone 1 exposes a single read-only command. System metric collectors
//! are not implemented yet; see docs/ARCHITECTURE.md.

use serde::Serialize;

/// Static build and runtime info. Mirrors `AppInfo` in src/lib/backend.ts.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct AppInfo {
    pub name: &'static str,
    pub version: &'static str,
    pub os: &'static str,
    pub arch: &'static str,
}

impl AppInfo {
    pub fn current() -> Self {
        Self {
            name: "Lumo",
            version: env!("CARGO_PKG_VERSION"),
            os: std::env::consts::OS,
            arch: std::env::consts::ARCH,
        }
    }
}

#[tauri::command]
fn app_info() -> AppInfo {
    AppInfo::current()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![app_info])
        .run(tauri::generate_context!())
        .expect("error while running Lumo");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn app_info_reports_package_version_and_platform() {
        let info = AppInfo::current();
        assert_eq!(info.name, "Lumo");
        assert_eq!(info.version, env!("CARGO_PKG_VERSION"));
        assert_eq!(info.os, std::env::consts::OS);
        assert_eq!(info.arch, std::env::consts::ARCH);
    }

    #[test]
    fn app_info_serializes_to_frontend_shape() {
        let json = serde_json::to_value(AppInfo::current()).unwrap();
        let obj = json.as_object().unwrap();
        let mut keys: Vec<_> = obj.keys().map(String::as_str).collect();
        keys.sort_unstable();
        assert_eq!(keys, ["arch", "name", "os", "version"]);
    }
}
