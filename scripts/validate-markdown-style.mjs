#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function runGit(args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function getChangedMarkdownFiles() {
  const output = runGit(['status', '--porcelain=v1', '--untracked-files=all']);
  if (!output) {
    return [];
  }

  return output.split(/\r?\n/).map((line) => line.slice(3)).filter((filePath) => {
    return filePath.endsWith('.md')
      && (filePath.startsWith('strategy/')
        || filePath.startsWith('external-network/')
        || filePath.startsWith('fundraising/')
        || filePath === 'README.md')
      && !filePath.includes('transcripts/')
      && !filePath.includes('analysis/context-exports/')
      && !filePath.includes('strategy/roadmaps/archive/')
      && fs.existsSync(path.join(repoRoot, filePath));
  });
}

function loadGlossaryTerms() {
  const glossaryPath = path.join(repoRoot, 'strategy', 'glossary.md');
  if (!fs.existsSync(glossaryPath)) return new Set();
  const glossaryText = fs.readFileSync(glossaryPath, 'utf8');
  const terms = new Set();

  for (const line of glossaryText.split(/\r?\n/)) {
    const match = line.match(/^[-*] ([A-Za-z0-9][A-Za-z0-9\-\/ ]+):/);
    if (match) {
      terms.add(match[1].trim());
    }
  }

  return terms;
}

function validateGlossaryEntries(glossaryText) {
  const violations = [];
  const allowedAcronyms = new Set([
    'CREAI',
    'IAE',
    'IRTS',
    'URIOPSS',
    'AAJD',
    'ADAPEI',
    'ADN',
    'ADR',
    'AGEVAL',
    'AHI',
    'APAEIA',
    'ARS',
    'CA',
    'CDD',
    'CSE',
    'DAO',
    'DG',
    'DMP',
    'DU',
    'ESAT',
    'IA',
    'INS',
    'LUMIA',
    'MSSANTÉ',
    'OSP',
    'SI',
    'UNAPEI',
    'API',
    'ARR',
    'B2B',
    'B2B2C',
    'B2C',
    'CAC',
    'CI',
    'AI',
    'CRM',
    'DMG',
    'DUI',
    'DMP',
    'DUERP',
    'EHPAD',
    'ERP',
    'ESSMS',
    'EU',
    'GEPP',
    'GPI',
    'HAS',
    'HDS',
    'HR',
    'ID',
    'IME',
    'IMAGO',
    'ITEP',
    'JWT',
    'LOI',
    'LB',
    'LTV',
    'MRR',
    'MVP',
    'PH',
    'PCA',
    'PDE',
    'PDS',
    'PMF',
    'PR',
    'RLS',
    'RH',
    'SDI',
    'SLO',
    'SaaS',
    'SSO',
    'STL',
    'TAM',
    'TTL',
    'UI',
    'US',
    'UTC',
    'URL',
    'UX',
    'UX/UI',
    'XML',
    'JSON',
    'HTML',
    'CSS',
    'PNG',
    'PDF',
    'README',
  ]);

  let currentSection = '';

  for (const line of glossaryText.split(/\r?\n/)) {
    const sectionMatch = line.match(/^##\s+(.+)$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      continue;
    }

    const entryMatch = line.match(/^[-*] ([A-Za-z0-9][A-Za-z0-9\-\/ ]+):/);
    if (!entryMatch) {
      continue;
    }

    const term = entryMatch[1].trim();
    if (/^[A-Z0-9][A-Z0-9\-\/ ]*$/.test(term) && !allowedAcronyms.has(term)) {
      violations.push(`glossary entry ${term} in ${currentSection} looks like a placeholder abbreviation but is not in the allowed acronym list`);
    }
  }

  return violations;
}

function findViolations(filePath, content, glossaryTerms) {
  const violations = [];
  const absoluteLinkPattern = /\]\((?:\/Users\/|file:\/\/)[^)]+\)/g;
  const contentWithoutUrls = content.replace(/https?:\/\/\S+/g, '');
  const mixedLanguagePatterns = [
    /\bportal-usager\b/gi,
    /\breduced ressaisie\b/gi,
  ];
  const firstPersonTokens = [
    "I'm", "I've", "I'd", "my", "mine", "we", "ours", "our",
    "je", "j'", "moi", "me", "mon", "ma", "mes", "nous", "notre", "nos",
  ];
  const tokenPattern = /\b[A-Z]{2,}(?:\/[A-Z]{2,})?\b/g;
  const allowedTokens = new Set([
    ...glossaryTerms,
    'ADAPEI', 'ADN', 'API', 'ARR', 'B2B', 'B2B2C', 'B2C', 'CA', 'CAC', 'CDD', 'CI', 'AI', 'CRM', 'DAO', 'DMG', 'DMP', 'DU', 'DUI', 'DUERP', 'EHPAD', 'ERP', 'ESSMS', 'EU', 'GEPP', 'GPI', 'HAS', 'HDS', 'HR', 'IA', 'ID', 'IME', 'IMAGO', 'INS', 'ITEP', 'JWT', 'LTV', 'LUMIA', 'MRR', 'MSSANTÉ', 'MVP', 'PH', 'PCA', 'PDE', 'PDS', 'PMF', 'PR', 'ESMS', 'RH', 'SDI', 'SI', 'SLO', 'SaaS', 'US', 'SSO', 'TAM', 'TTL', 'UI', 'UX', 'UTC', 'URL', 'XML', 'JSON', 'HTML', 'CSS', 'PNG', 'PDF', 'README', 'LB', 'STL',
  ]);

  for (const match of content.matchAll(absoluteLinkPattern)) {
    violations.push(`absolute internal link: ${match[0]}`);
  }

  for (const pattern of mixedLanguagePatterns) {
    if (pattern.test(contentWithoutUrls)) {
      violations.push('mixed-language hybrid term found');
      break;
    }
  }

  let inDraftFollowUpEmail = false;
  for (const line of contentWithoutUrls.split(/\r?\n/)) {
    if (/^### Draft follow-up email\s*$/.test(line)) {
      inDraftFollowUpEmail = true;
      continue;
    }
    if (inDraftFollowUpEmail && /^###\s+/.test(line) && !/^### Draft follow-up email\s*$/.test(line)) {
      inDraftFollowUpEmail = false;
    }
    if (inDraftFollowUpEmail) continue;

    for (const token of firstPersonTokens) {
      const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const tokenPattern = new RegExp(`(?<![\\p{L}\\p{N}'])${escapedToken}(?![\\p{L}\\p{N}'])`, 'iu');
      if (tokenPattern.test(line)) {
        violations.push('first-person phrasing found');
        return violations;
      }
    }
  }

  for (const match of content.matchAll(tokenPattern)) {
    const token = match[0];
    if (!allowedTokens.has(token) && !allowedTokens.has(token + 'É')) {
        // Simple hack for MSSANTÉ vs MSSANT mismatch if the regex stops at accents
        violations.push(`unlisted abbreviation: ${token}`);
    }
  }

  return violations;
}

const changedFiles = getChangedMarkdownFiles();
if (changedFiles.length === 0) {
  process.exit(0);
}

const glossaryPath = path.join(repoRoot, 'strategy', 'glossary.md');
const glossaryText = fs.readFileSync(glossaryPath, 'utf8');
const glossaryViolations = validateGlossaryEntries(glossaryText);
const glossaryTerms = loadGlossaryTerms();
const problems = [];

if (glossaryViolations.length > 0) {
  problems.push(`strategy/glossary.md:\n  - ${glossaryViolations.join('\n  - ')}`);
}

for (const filePath of changedFiles) {
  const absolutePath = path.join(repoRoot, filePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const violations = findViolations(filePath, content, glossaryTerms);
  if (violations.length > 0) {
    problems.push(`${filePath}:\n  - ${violations.join('\n  - ')}`);
  }
}

if (problems.length > 0) {
  console.error('Markdown style policy violation(s):');
  for (const problem of problems) {
    console.error(problem);
  }
  process.exit(2);
}
