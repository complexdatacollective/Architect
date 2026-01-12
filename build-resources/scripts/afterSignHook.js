/**
 * After Sign Hook - Notarizes macOS apps for distribution
 *
 * This script runs after code signing and submits the app to Apple's
 * notarization service. Required for macOS apps distributed outside
 * the Mac App Store.
 *
 * Required environment variables:
 * - APPLE_API_KEY_ID: App Store Connect API Key ID
 * - APPLE_API_KEY_ISSUER: App Store Connect API Key Issuer ID
 * - APPLE_API_KEY_PATH: Path to the .p8 private key file
 *
 * @see https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution
 */
const { notarize } = require('@electron/notarize');
const path = require('path');
const fs = require('fs');

async function afterSignHook(context) {
  const { electronPlatformName, appOutDir } = context;

  // Only notarize macOS builds
  if (electronPlatformName !== 'darwin') {
    console.log('Skipping notarization: not macOS');
    return;
  }

  // Check if notarization is enabled
  if (process.env.SKIP_NOTARIZE === 'true') {
    console.log('Skipping notarization: SKIP_NOTARIZE is set');
    return;
  }

  // Validate required environment variables
  const apiKeyId = process.env.APPLE_API_KEY_ID;
  const apiKeyIssuerId = process.env.APPLE_API_KEY_ISSUER;
  const apiKeyPath = process.env.APPLE_API_KEY_PATH;

  if (!apiKeyId || !apiKeyIssuerId || !apiKeyPath) {
    console.log('Skipping notarization: Apple API credentials not configured');
    console.log('Set APPLE_API_KEY_ID, APPLE_API_KEY_ISSUER, and APPLE_API_KEY_PATH');
    return;
  }

  // Resolve API key path
  const resolvedKeyPath = apiKeyPath.startsWith('~')
    ? path.join(process.env.HOME, apiKeyPath.slice(1))
    : path.resolve(apiKeyPath);

  if (!fs.existsSync(resolvedKeyPath)) {
    console.error(`API key file not found: ${resolvedKeyPath}`);
    return;
  }

  // Get app path
  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);

  if (!fs.existsSync(appPath)) {
    console.error(`Application not found: ${appPath}`);
    return;
  }

  console.log(`Notarizing ${appName}...`);
  console.log(`App path: ${appPath}`);

  try {
    await notarize({
      tool: 'notarytool',
      appBundleId: 'org.complexdatacollective.networkcanvas.architect',
      appPath,
      appleApiKey: resolvedKeyPath,
      appleApiKeyId: apiKeyId,
      appleApiIssuer: apiKeyIssuerId,
    });

    console.log(`Successfully notarized ${appName}`);
  } catch (error) {
    console.error('Notarization failed:', error.message);
    throw error;
  }
}

module.exports = afterSignHook;
