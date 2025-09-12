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

// Stub for Google Safe Browsing/PhishTank (returns false, to be implemented)
async function isBlacklisted(url) {
  // TODO: Integrate with Google Safe Browsing or PhishTank APIs
  // Return true if blacklisted, false otherwise
  return false;
}

// Stub for WHOIS check (returns false, to be implemented)
async function isRecentlyRegistered(hostname) {
  // TODO: Integrate with WHOIS API to check domain registration date
  // Return true if registered within last 30 days
  return false;
}

// Stub for TLS check (returns false, to be implemented)
async function hasTlsIssues(url) {
  // TODO: Fetch and check certificate validity/expiration
  return false;
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
