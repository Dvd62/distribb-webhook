/**
 * Connect to live Distribb account
 * Test API key and list projects with full details
 */

require('dotenv').config();
const { DistribbClient } = require('./distribb-client');

async function connectAndTest() {
  console.log('🔌 Connecting to Distribb...\n');
  
  try {
    const client = new DistribbClient();
    
    // Test 1: List projects
    console.log('📁 Fetching projects...');
    const response = await client.listProjects();
    const projects = response.projects || [];
    
    console.log(`✅ Found ${projects.length} project(s):\n`);
    
    projects.forEach(p => {
      console.log(`📌 ${p.BusinessName || p.Name || 'Unnamed Project'}`);
      console.log(`   ID: ${p.ID}`);
      console.log(`   Description: ${p.BusinessDescription?.substring(0, 80)}...`);
      console.log(`   Articles/Day: ${p.ArticlesPerDay}`);
      console.log(`   Backlink Credits: ${p.BacklinkCredits}`);
      console.log(`   Network Participation: ${p.BecklinksNetworkParticipation}`);
      console.log('');
    });
    
    // Test 2: Try to list articles if endpoint exists
    console.log('📝 Checking for articles endpoint...');
    try {
      const articlesRes = await client.listArticles({ limit: 5 });
      const articles = articlesRes.articles || articlesRes;
      console.log(`✅ Found ${articles.length} article(s)\n`);
    } catch (e) {
      console.log(`ℹ️  Articles endpoint: ${e.message}\n`);
    }
    
    console.log('✅ Connection successful!');
    console.log('\n📋 Summary:');
    console.log(`   Account: ${projects[0]?.BusinessName || 'Unknown'}`);
    console.log(`   Projects: ${projects.length}`);
    console.log(`   Webhook: Ready to receive at /webhooks/distribb`);
    
    return { connected: true, projects };
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    return { connected: false, error: error.message };
  }
}

connectAndTest();
