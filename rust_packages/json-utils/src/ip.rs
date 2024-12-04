use if_addrs::get_if_addrs;
use std::net::IpAddr;

pub fn get_ips() -> Vec<IpAddr> {
    let mut ips = Vec::new();
    if let Ok(interfaces) = get_if_addrs() {
        for interface in interfaces {
            let ip = interface.ip();
            ips.push(ip);
        }
    }
    ips
}
