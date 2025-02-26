#!/usr/bin/env node

/**
 * This script helps identify components that need to be migrated to shadcn/ui
 * It scans the codebase for component usage patterns and provides a report
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// shadcn/ui components we expect to use
const SHADCN_COMPONENTS = [
  'Button', 'Input', 'Checkbox', 'Select', 'Textarea', 'RadioGroup', 'Switch',
  'Slider', 'Card', 'Dialog', 'Popover', 'Tooltip', 'DropdownMenu',
  'Tabs', 'Form', 'Toast', 'Alert', 'Badge', 'Avatar', 'Separator',
  'Sheet', 'Skeleton', 'Table', 'Accordion'
];

// Check if a component is imported from shadcn/ui
function isShadcnImport(line) {
  return line.includes('@/components/ui') && SHADCN_COMPONENTS.some(component => 
    line.includes(`import { ${component}`) || line.includes(`import {${component}`)
  );
}

// Check if a component is used but not imported from shadcn/ui
function isNonShadcnComponent(content, component) {
  const regex = new RegExp(`<${component}[\\s>]`, 'g');
  return regex.test(content);
}

// Find all React component files
function findComponentFiles() {
  return glob.sync('src/**/*.{tsx,jsx}', {
    ignore: ['src/components/ui/**', 'node_modules/**', '.next/**']
  });
}

// Main function
async function main() {
  console.log('📊 shadcn/ui Component Migration Analysis');
  console.log('=========================================\n');

  const files = findComponentFiles();
  console.log(`Found ${files.length} component files to analyze\n`);

  let needsMigration = [];
  let alreadyMigrated = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    let hasShadcnImport = false;
    let nonShadcnComponents = [];

    // Check imports
    for (const line of lines) {
      if (isShadcnImport(line)) {
        hasShadcnImport = true;
      }
    }

    // Check component usage
    for (const component of SHADCN_COMPONENTS) {
      if (isNonShadcnComponent(content, component) && 
          !content.includes(`import { ${component}`) && 
          !content.includes(`from '@/components/ui`)) {
        nonShadcnComponents.push(component);
      }
    }

    if (nonShadcnComponents.length > 0) {
      needsMigration.push({
        file,
        components: nonShadcnComponents
      });
    } else if (hasShadcnImport) {
      alreadyMigrated.push(file);
    }
  }

  console.log('✅ Already Using shadcn/ui:');
  console.log('-------------------------');
  if (alreadyMigrated.length === 0) {
    console.log('No components currently using shadcn/ui');
  } else {
    alreadyMigrated.forEach(file => console.log(`- ${file}`));
  }

  console.log('\n🔄 Needs Migration:');
  console.log('----------------');
  if (needsMigration.length === 0) {
    console.log('No components identified for migration');
  } else {
    needsMigration.forEach(item => {
      console.log(`- ${item.file}`);
      console.log(`  Components to migrate: ${item.components.join(', ')}`);
    });
  }

  console.log('\n📝 Migration Report Summary:');
  console.log('-------------------------');
  console.log(`Total components: ${files.length}`);
  console.log(`Already migrated: ${alreadyMigrated.length}`);
  console.log(`Needs migration: ${needsMigration.length}`);
  console.log(`Migration progress: ${Math.round((alreadyMigrated.length / files.length) * 100)}%`);
}

main().catch(console.error); 