'use strict';
const { getJson } = require('./httpjson');

// Returns this machine's public IP address
async function myPublicIp() {
  const { ok, data } = await getJson('https://api.ipify.org?format=json');
  if (!ok || !data?.ip) throw new Error('Failed to fetch public IP.');
  return data.ip;
}

// Geo/network info for an IP or domain, from a free public service (ipapi.co)
async function lookupIp(target) {
  const { ok, status, data } = await getJson(`https://ipapi.co/${encodeURIComponent(target)}/json/`);
  if (!ok) throw new Error(`IP info service returned an error (status ${status}).`);
  if (data?.error) throw new Error(data.reason || 'Invalid IP or domain.');
  return {
    ip: data.ip,
    city: data.city,
    region: data.region,
    country: data.country_name,
    countryCode: data.country_code,
    postal: data.postal,
    isp: data.org,
    asn: data.asn,
    timezone: data.timezone,
    lat: data.latitude,
    lon: data.longitude,
  };
}

module.exports = { myPublicIp, lookupIp };
