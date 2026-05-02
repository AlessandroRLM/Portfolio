const fs = require('fs');

const indexPath = './index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// The class mappings
const classMap = {
    'k': 'item-key',
    'v': 'item-val',
    'idx': 'item-idx',
    't': 'card-title',
    'd': 'card-desc',
    'a': 'card-active',
    'sh-num': 'section-num',
    'sh-title': 'section-title',
    'sk-row': 'skill-row',
    'sk-idx': 'skill-idx',
    'sk-k': 'skill-key',
    'sk-v': 'skill-val',
    'val-grid': 'value-grid',
    'val-card': 'value-card',
    'xp-row': 'xp-row',
    'xp-y': 'xp-year',
    'xp-r': 'xp-role',
    'xp-c': 'xp-company',
    'xp-d': 'xp-desc',
    'pr-row': 'project-row',
    'pr-y': 'project-year',
    'pr-n': 'project-name',
    'pr-meta': 'project-meta',
    'pr-d': 'project-desc',
    'pr-s': 'project-stack',
    'ct-lede': 'contact-lede',
    'ct-mail': 'contact-mail',
    'ct-grid': 'contact-grid',
    'ct-links': 'contact-links',
    'ct-form': 'contact-form',
    'ct-field': 'contact-field',
    'ct-send': 'contact-send',
    'ft-big': 'footer-big',
    'ft-row': 'footer-row'
};

// 1. Extract style block
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
    console.log("No <style> block found.");
    process.exit(1);
}

let inlineCss = styleMatch[1];
let remainingHtml = html.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="/src/styles/styles.css">');

// 2. Perform replacements on CSS
// We replace .classname followed by \b or pseudoclass/space/comma
for (const [oldClass, newClass] of Object.entries(classMap)) {
    // regex for css class selector: dot followed by exact class name, then NOT a hyphen or word char
    const cssRegex = new RegExp(`\\.${oldClass}(?![\\w\\-])`, 'g');
    inlineCss = inlineCss.replace(cssRegex, `.${newClass}`);
}

// 3. Perform replacements on HTML class attributes
remainingHtml = remainingHtml.replace(/class="([^"]+)"/g, (match, classNames) => {
    const classes = classNames.split(/\s+/);
    const newClasses = classes.map(c => classMap[c] || c);
    return `class="${newClasses.join(' ')}"`;
});

fs.writeFileSync('new_index.html', remainingHtml);
fs.writeFileSync('new_styles.css', inlineCss);
console.log("Done refactoring.");
