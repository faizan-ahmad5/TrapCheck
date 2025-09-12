// utils/analyzer.js
// Modular phishing URL analyzer utility
// Security: Never executes remote JS, only fetches headers/body with timeouts

const { URL } = require("url");
const punycode = require("punycode/");
const fetch = require("node-fetch");

const SUSPICIOUS_TLDS = ["tk", "ml", "ga", "cf", "gq"];
const SUSPICIOUS_KEYWORDS = [
  "login",
  "secure",
  "account",
  "update",
  "verify",
  "bank",
  "signin",
];

// Real implementation: Google Safe Browsing (example, requires API key)
async function isBlacklisted(url) {
  // Example: Use Google Safe Browsing API (requires API key)
  // const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  // const resp = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     client: { clientId: 'trapcheck', clientVersion: '1.0' },
  //     threatInfo: {
  //       threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
  //       platformTypes: ['ANY_PLATFORM'],
  //       threatEntryTypes: ['URL'],
  //       threatEntries: [{ url }],
  //     },
  //   }),
  // });
  // const data = await resp.json();
  // return !!data.matches;
  // For now, always return false (not blacklisted)
  return false;
}

// Real implementation: WHOIS API (example, requires API key)
async function isRecentlyRegistered(hostname) {
  // Example: Use WhoisXML API (requires API key)
  // const apiKey = process.env.WHOIS_API_KEY;
  // const resp = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${hostname}&outputFormat=JSON`);
  // const data = await resp.json();
  // const createdDate = new Date(data.WhoisRecord.createdDate);
  // const now = new Date();
  // const days = (now - createdDate) / (1000 * 60 * 60 * 24);
  // return days < 30;
  // For now, always return false (not recently registered)
  return false;
}

// Real implementation: TLS/SSL check using Node.js tls module
const tls = require("tls");
const net = require("net");
async function hasTlsIssues(inputUrl) {
  try {
    const { hostname } = new URL(inputUrl);
    return await new Promise((resolve) => {
      const socket = tls.connect(
        443,
        hostname,
        { servername: hostname, timeout: 5000 },
        () => {
          const cert = socket.getPeerCertificate();
          socket.end();
          if (!cert || !cert.valid_to) return resolve(true);
          const expires = new Date(cert.valid_to);
          if (expires < new Date()) return resolve(true); // expired
          resolve(false);
        }
      );
      socket.on("error", () => resolve(true));
      socket.on("timeout", () => {
        socket.destroy();
        resolve(true);
      });
    });
  } catch {
    return true;
  }
}

async function analyzeUrl(inputUrl) {
  let score = 0;
  const reasons = [];
  let verdict = "likely_safe";

  try {
    const urlObj = new URL(inputUrl);
    const hostname = urlObj.hostname;
    // 1. IP in hostname
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      score += 30;
      reasons.push("URL uses an IP address");
    }
    // 2. Punycode
    if (hostname.startsWith("xn--")) {
      score += 20;
      reasons.push("Punycode domain detected");
    }
    // 3. Suspicious TLD
    const tld = hostname.split(".").pop();
    if (SUSPICIOUS_TLDS.includes(tld)) {
      score += 20;
      reasons.push("Suspicious TLD: ." + tld);
    }
    // 4. @ in URL
    if (inputUrl.includes("@")) {
      score += 15;
      reasons.push("URL contains @ symbol");
    }
    // 5. 4+ subdomains
    const subdomainCount = hostname.split(".").length - 2;
    if (subdomainCount >= 4) {
      score += 15;
      reasons.push("URL has 4 or more subdomains");
    }
    // 6. Suspicious keywords
    for (const kw of SUSPICIOUS_KEYWORDS) {
      if (inputUrl.toLowerCase().includes(kw)) {
        score += 10;
        reasons.push("Keyword detected: " + kw);
      }
    }
    // 7. Blacklist check (Google Safe Browsing/PhishTank)
    if (await isBlacklisted(inputUrl)) {
      score += 50;
      reasons.push("URL found in phishing blacklist");
    }
    // 8. WHOIS: recent registration
    if (await isRecentlyRegistered(hostname)) {
      score += 20;
      reasons.push("Domain registered recently (WHOIS)");
    }
    // 9. TLS issues
    if (await hasTlsIssues(inputUrl)) {
      score += 20;
      reasons.push("TLS/SSL certificate issues detected");
    }
    if (score >= 60) verdict = "malicious";
    else if (score >= 30) verdict = "suspicious";
    else verdict = "likely_safe";
  } catch (err) {
    score = 100;
    verdict = "malicious";
    reasons.push("Invalid or malformed URL");
  }

  return { score, verdict, reasons };
}

module.exports = { analyzeUrl };
