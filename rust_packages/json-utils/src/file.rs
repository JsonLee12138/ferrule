use std::env::current_dir;
use std::io::{Result, Error};
use std::path::PathBuf;

pub fn __dirname() -> Result<PathBuf> {
    current_dir()
}

pub fn resolve(base_path: &PathBuf, relative_path: &str) -> Result<PathBuf> {
    let mut path = PathBuf::from(base_path);
    path.push(relative_path);
    path.canonicalize().map_err(|e| Error::new(e.kind(), format!("{} is not file or directory", path.display())))
}
