// Historical release markers retained for cache cleanup compatibility.
// lulu-pwa-20260808-transfer-image-durability-v80
// social-forum-v81
// lulu-pwa-20260811-chat-mobile-width-v94
// lulu-pwa-20260811-social-intent-forum-v95
// lunara-ai-20260812-miya-whale-v96
// lunara-ai-20260812-desktop-repair-v98
// lunara-ai-20260812-notice-pet-v101
// lunara-ai-20260813-safari-fast-start-v113
// lunara-ai-20260813-chat-batch-delete-v115
// lunara-ai-20260813-fullscreen-widgets-v116
// lunara-ai-20260813-app-control-desktop-v120
// lunara-ai-20260813-pwa-update-v121
// lunara-ai-20260813-widget-wallpaper-api-auth-v122-8

const RELEASE_VERSION = 'v325-avatar-crop-group-avatar-review';
const RELEASE_BUILD = 20260910018;
const CACHE_VERSION = 'lunara-ai-20260910-chat-photo-42';
const OPTIONAL_CACHE_VERSION = `${CACHE_VERSION}-optional`;
const RELEASE_MARKER = '/.lunara-release.json';
const PREPARED_CLIENTS = new Set();
const LEGACY_CACHES = new Set([
  'lunara-ai-20260910-cloud-integrity-39',
  'lunara-ai-20260910-cloud-integrity-39-optional',
  'lunara-ai-20260910-chat-regeneration-38',
  'lunara-ai-20260910-chat-regeneration-38-optional',
  'lunara-ai-20260910-npc-hydration-37',
  'lunara-ai-20260910-npc-hydration-37-optional',
  'lunara-ai-20260910-relationship-profile-36',
  'lunara-ai-20260910-relationship-profile-36-optional',
  'lunara-ai-20260910-relationship-nocturne-35',
  'lunara-ai-20260910-relationship-nocturne-35-optional',
  'lunara-ai-20260910-relationship-archive-34',
  'lunara-ai-20260910-relationship-archive-34-optional',
  'lunara-ai-20260910-npc-relationship-network-33',
  'lunara-ai-20260910-npc-relationship-network-33-optional',
  'lunara-ai-20260910-memory-source-route-32',
  'lunara-ai-20260910-memory-source-route-32-optional',
  'lunara-ai-20260910-bond-interface-31',
  'lunara-ai-20260910-bond-interface-31-optional',
  'lunara-ai-20260910-memory-ui-30',
  'lunara-ai-20260910-memory-ui-30-optional',
  'lunara-ai-20260910-memory-management-29',
  'lunara-ai-20260910-memory-management-29-optional',
  'lunara-ai-20260910-review-corrections-28',
  'lunara-ai-20260910-review-corrections-28-optional',
  'lunara-ai-20260910-full-backup-import-27',
  'lunara-ai-20260910-full-backup-import-27-optional',
  'lunara-ai-20260910-chat-image-menu-26',
  'lunara-ai-20260910-chat-image-menu-26-optional',
  'lunara-ai-20260910-moments-delete-25',
  'lunara-ai-20260910-moments-delete-25-optional',
  'lunara-ai-20260909-review-findings-repair-22',
  'lunara-ai-20260909-review-findings-repair-22-optional',
  'lunara-ai-20260909-relay-fallback-channel-guidance-21',
  'lunara-ai-20260909-relay-fallback-channel-guidance-21-optional',
  'lunara-ai-20260909-mobile-scroll-performance-repair-20',
  'lunara-ai-20260909-mobile-scroll-performance-repair-20-optional',
  'lunara-ai-20260909-fanfic-generation-repair-19',
  'lunara-ai-20260909-fanfic-generation-repair-19-optional',
  'lunara-ai-20260909-mobile-image-save-repair-18',
  'lunara-ai-20260909-mobile-image-save-repair-18-optional',
  'lunara-ai-20260909-chat-branch-list-render-repair-17',
  'lunara-ai-20260909-chat-branch-list-render-repair-17-optional',
  'lunara-ai-20260909-moments-cover-upload-repair-16',
  'lunara-ai-20260909-moments-cover-upload-repair-16-optional',
  'lunara-ai-20260908-chat-video-single-request-review-15',
  'lunara-ai-20260908-chat-video-single-request-review-15-optional',
  'lunara-ai-20260908-chat-video-retry-review-14',
  'lunara-ai-20260908-chat-video-retry-review-14-optional',
  'lunara-ai-20260908-worldbook-import-review-13',
  'lunara-ai-20260908-worldbook-import-review-13-optional',
  'lunara-ai-20260908-desktop-swipe-review-12',
  'lunara-ai-20260908-desktop-swipe-review-12-optional',
  'lunara-ai-20260908-data-import-picker-review-11',
  'lunara-ai-20260908-data-import-picker-review-11-optional',
  'lunara-ai-20260908-chat-translation-review-10',
  'lunara-ai-20260908-chat-translation-review-10-optional',
  'lunara-ai-20260908-diet-energy-review-9',
  'lunara-ai-20260908-diet-energy-review-9-optional',
  'lunara-ai-20260908-role-ledger-review-8',
  'lunara-ai-20260908-role-ledger-review-8-optional',
  'lunara-ai-20260908-cycle-journal-review-7',
  'lunara-ai-20260908-cycle-journal-review-7-optional',
  'lunara-ai-20260908-memo-paper-review-6',
  'lunara-ai-20260908-memo-paper-review-6-optional',
  'lunara-ai-20260908-couple-nest-review-5',
  'lunara-ai-20260908-couple-nest-review-5-optional',
  'lunara-ai-20260908-diary-studio-review-4',
  'lunara-ai-20260908-diary-studio-review-4-optional',
  'lunara-ai-20260908-moments-api-style-review-3',
  'lunara-ai-20260908-moments-api-style-review-3-optional',
  'lunara-ai-20260908-app-api-import-review-2',
  'lunara-ai-20260908-app-api-import-review-2-optional',
  'lunara-ai-20260908-import-compat-review-1',
  'lunara-ai-20260908-import-compat-review-1-optional',
  'lunara-ai-20260907-avatar-crop-group-avatar-review-2',
  'lunara-ai-20260904-cloud-auth-sync-admin-v303-4',
  'lunara-ai-20260904-cloud-auth-sync-admin-v303-4-optional',
  'lunara-ai-20260904-cloud-auth-sync-admin-v303-3',
  'lunara-ai-20260904-cloud-auth-sync-admin-v303-3-optional',
  'lunara-ai-20260904-chat-translation-pwa-v303-2',
  'lunara-ai-20260904-chat-translation-pwa-v303-2-optional',
  'lunara-ai-20260904-mobile-safearea-music-v303-1',
  'lunara-ai-20260904-mobile-safearea-music-v303-1-optional',
  'lunara-ai-20260902-tantan-diverse-chat-bubble-v302-1',
  'lunara-ai-20260902-tantan-diverse-chat-bubble-v302-1-optional',
  'lunara-ai-20260902-offline-tantan-stranger-flow-v294-1',
  'lunara-ai-20260902-offline-tantan-stranger-flow-v294-1-optional',
  'lunara-ai-20260901-lulu-splash-confirmed-v292-1',
  'lunara-ai-20260901-lulu-splash-confirmed-v292-1-optional',
  'lunara-ai-20260901-minimax-tts-relay-v291-1',
  'lunara-ai-20260901-minimax-tts-relay-v291-1-optional',
  'lunara-ai-20260901-memory-netease-repair-v281-1',
  'lunara-ai-20260901-memory-netease-repair-v281-1-optional',
  'lunara-ai-20260901-role-controlled-passcode-v280-1',
  'lunara-ai-20260901-role-controlled-passcode-v280-1-optional',
  'lunara-ai-20260901-role-controlled-passcode-v278-1',
  'lunara-ai-20260901-role-controlled-passcode-v278-1-optional',
  'lunara-ai-20260901-role-phone-passcode-six-digit-v277-1',
  'lunara-ai-20260901-role-phone-passcode-six-digit-v277-1-optional',
  'lunara-ai-20260831-netease-playback-repair-v275-1',
  'lunara-ai-20260831-netease-playback-repair-v275-1-optional',
  'lunara-ai-20260831-ios-chat-index-storage-silent-v274-1',
  'lunara-ai-20260831-ios-chat-index-storage-silent-v274-1-optional',
  'lunara-ai-20260831-role-relations-desktop-performance-v270-1',
  'lunara-ai-20260831-role-relations-desktop-performance-v270-1-optional',
  'lunara-ai-20260831-float-voice-stt-final-repair-v267-1',
  'lunara-ai-20260831-float-voice-stt-final-repair-v267-1-optional',
  'lunara-ai-20260831-float-voice-parity-v266-1',
  'lunara-ai-20260831-float-voice-parity-v266-1-optional',
  'lunara-ai-20260831-voice-hold-audio-repair-v265-1',
  'lunara-ai-20260831-voice-hold-audio-repair-v265-1-optional',
  'lunara-ai-20260831-voice-poke-wallpaper-repair-v264-1',
  'lunara-ai-20260831-voice-poke-wallpaper-repair-v264-1-optional',
  'lunara-ai-20260830-voice-avatar-pwa-repair-v262-1',
  'lunara-ai-20260830-voice-avatar-pwa-repair-v262-1-optional',
  'lunara-ai-20260830-voice-hold-role-phone-white-screen-v261-1',
  'lunara-ai-20260830-voice-hold-role-phone-white-screen-v261-1-optional',
  'lunara-ai-20260830-memory-identity-transfer-call-v260-1',
  'lunara-ai-20260830-memory-identity-transfer-call-v260-1-optional',
  'lunara-ai-20260830-role-regex-time-phone-repair-v259-1',
  'lunara-ai-20260830-role-regex-time-phone-repair-v259-1-optional',
  'lunara-ai-20260830-chat-storage-v258-1',
  'lunara-ai-20260830-chat-storage-v258-1-optional',
  'lunara-ai-20260829-float-assistant-v255-1',
  'lunara-ai-20260829-float-assistant-v255-1-optional',
  'lunara-ai-20260829-storage-time-media-bond-v253-1',
  'lunara-ai-20260829-storage-time-media-bond-v253-1-optional',
  'lunara-ai-20260829-life-voice-call-translation-v252-1',
  'lunara-ai-20260829-life-voice-call-translation-v252-1-optional',
  'lunara-ai-20260828-state-social-diary-image-hardening-v251-2',
  'lunara-ai-20260828-state-social-diary-image-hardening-v251-2-optional',
  'lunara-ai-20260828-auth-failure-guidance-v246-2',
  'lunara-ai-20260828-auth-failure-guidance-v246-2-optional',
  'lunara-ai-20260828-auth-failure-guidance-v246-1',
  'lunara-ai-20260828-auth-failure-guidance-v246-1-optional',
  'lunara-ai-20260828-chat-send-readiness-v242-3',
  'lunara-ai-20260828-chat-send-readiness-v242-3-optional',
  'lunara-ai-20260828-chat-persistence-v242-1',
  'lunara-ai-20260828-chat-persistence-v242-1-optional',
  'lunara-ai-20260828-phone-inspection-v241-41',
  'lunara-ai-20260828-phone-inspection-v241-41-optional',
  'lunara-ai-20260827-phone-inspection-v241-32',
  'lunara-ai-20260827-phone-inspection-v241-32-optional',
  'lunara-ai-20260827-phone-inspection-v241-30',
  'lunara-ai-20260827-phone-inspection-v241-30-optional',
  'lunara-ai-20260828-api-quota-guard-v243-1',
  'lunara-ai-20260828-api-model-pwa-v242-2',
  'lunara-ai-20260828-state-social-diary-image-hardening-v250-1',
  'lunara-ai-20260828-state-social-diary-image-hardening-v250-1-optional',
  'lunara-ai-20260828-state-social-diary-image-hardening-v251-1',
  'lunara-ai-20260828-state-social-diary-image-hardening-v251-1-optional',
  'lunara-ai-20260824-keepalive-v232-1',
  'lunara-ai-20260823-api-compat-v221-1',
  'lunara-ai-20260823-api-compat-v221-2',
  'lunara-ai-20260823-api-compat-v220-1',
  'lunara-ai-20260822-memory-bond-fanfic-repair-v217-1',
  'lunara-ai-20260822-mcp-fetch-repair-v218-1',
  'lunara-ai-20260822-first-load-pwa-v212-1',
  'lunara-ai-20260822-music-stream-v210-1',
  'lunara-ai-20260822-music-timeout-v209-1',
  'lunara-ai-20260822-music-playback-repair-v208-2',
  'lunara-ai-20260822-music-playback-repair-v208-1',
  'lunara-ai-20260822-virtual-time-music-sticker-v207-1',
  'lunara-ai-20260821-image-inner-thought-v203-1',
  'lunara-ai-20260821-call-human-v202-3',
  'lunara-ai-20260821-call-human-v202-2',
  'lunara-ai-20260821-call-human-v202-1',
  'lunara-ai-20260821-role-rhythm-v201-2',
  'lunara-ai-20260821-role-rhythm-v201-1',
  'lunara-ai-20260821-safari-fullscreen-v200-1',
  'lunara-ai-20260821-safari-rescue-v200-1',
  'lunara-ai-20260819-local-review-v197-1',
  'lunara-ai-20260819-local-review-v196-1',
  'lunara-ai-20260819-local-review-v195-1',
  'lunara-ai-20260819-deployed-v193-1',
  'lunara-ai-20260819-deployed-v192-1',
  'lunara-ai-20260819-local-review-v191-1',
  'lunara-ai-20260819-local-review-v190-1',
  'lulu-pwa-20260808-transfer-image-durability-v80',
  'social-forum-v81',
  'lulu-pwa-20260811-chat-mobile-width-v94',
  'lulu-pwa-20260811-social-intent-forum-v95',
  'lulu-pwa-20260811-social-intent-forum-v95-1',
  'lunara-ai-20260812-miya-whale-v96',
  'lunara-ai-20260812-desktop-repair-v98',
  'lunara-ai-20260812-notice-pet-v101',
  'lunara-ai-20260813-safari-fast-start-v113',
  'lunara-ai-20260813-chat-batch-delete-v115',
  'lunara-ai-20260813-fullscreen-widgets-v116',
  'lunara-ai-20260813-app-control-desktop-v120',
  'lunara-ai-20260813-pwa-update-v121',
  'lunara-ai-20260813-widget-wallpaper-api-auth-v122-8',
  'lunara-ai-20260814-chat-settings-wallpaper-v128-1',
  'lunara-ai-20260814-atomic-sw-v129-1',
  'lunara-ai-20260814-critical-icons-v129-1',
  'lunara-ai-20260814-first-load-v129-1',
  'lunara-ai-20260814-local-first-login-v130-1',
  'lunara-ai-20260814-sync-media-integrity-v130-1',
  'lunara-ai-20260814-role-phone-v2-v131-1',
  'lunara-ai-20260814-role-phone-messages-v132-1',
  'lunara-ai-20260814-role-story-boundaries-v134-1',
  'lunara-ai-20260814-role-story-boundaries-v134-2'
  ,'lunara-ai-20260815-wallpaper-picker-v136-1',
  'lunara-ai-20260815-minimax-tts-v138-1',
  'lunara-ai-20260815-social-life-v139-1',
  'lunara-ai-20260815-pwa-desktop-masks-settings-gender-v140-1',
  'lunara-ai-20260815-invite-finalization-v141-1',
  'lunara-ai-20260815-passwordless-cloud-v142-1',
  'lunara-ai-20260816-passwordless-cloud-v142-2',
  'lunara-ai-20260816-cross-browser-translation-npc-v143-1',
  'lunara-ai-20260816-reply-ledger-visual-identity-v145-1',
  'lunara-ai-20260816-review-navigation-v146-3',
  'lunara-ai-20260816-local-review-proxy-v147-1',
  'lunara-ai-20260816-verified-release-activation-v151-2',
  'lunara-ai-20260816-local-review-v155-2',
  'lunara-ai-20260816-local-review-v156-1',
  'lunara-ai-20260816-local-review-v157-1',
  'lunara-ai-20260816-local-review-v158-1',
  'lunara-ai-20260816-local-review-v159-1',
  'lunara-ai-20260817-local-review-v160-1',
  'lunara-ai-20260817-local-review-v160-2',
  'lunara-ai-20260817-safari-desktop-recovery-v161-1',
  'lunara-ai-20260817-local-first-manual-cloud-v162-1',
  'lunara-ai-20260817-neko-aon-call-life-v163-1',
  'lunara-ai-20260817-local-review-v164-1',
  'lunara-ai-20260817-local-review-v165-1',
  'lunara-ai-20260817-local-review-v166-1',
  'lunara-ai-20260817-local-review-v166-2',
  'lunara-ai-20260817-local-review-v167-1',
  'lunara-ai-20260817-local-review-v168-1'
  ,'lunara-ai-20260817-local-review-v169-1',
  'lunara-ai-20260817-local-review-v170-1',
  'lunara-ai-20260817-local-review-v171-1',
  'lunara-ai-20260817-local-review-v172-1',
  'lunara-ai-20260817-local-review-v173-1',
  'lunara-ai-20260817-local-review-v174-1',
  'lunara-ai-20260817-local-review-v175-1',
  'lunara-ai-20260817-local-review-v176-1',
  'lunara-ai-20260817-local-review-v177-1',
  'lunara-ai-20260818-local-review-v178-1',
  'lunara-ai-20260818-local-review-v179-1',
  'lunara-ai-20260818-local-review-v180-1',
  'lunara-ai-20260818-local-review-v181-1',
  'lunara-ai-20260818-local-review-v182-1',
  'lunara-ai-20260818-local-review-v183-1'
  ,'lunara-ai-20260818-local-review-v184-1'
  ,'lunara-ai-20260818-local-review-v185-1'
  ,'lunara-ai-20260818-local-review-v185-2'
  ,'lunara-ai-20260818-local-review-v186-1'
  ,'lunara-ai-20260818-local-review-v187-1'
  ,'lunara-ai-20260818-local-review-v188-1'
  ,'lunara-ai-20260819-local-review-v189-1'
  ,'lunara-ai-20260819-local-review-v194-1'
  ,'lunara-ai-20260820-local-review-v198-1'
  ,'lunara-ai-20260820-local-review-v199-1'
  ,'lunara-ai-20260820-local-review-v199-2'
  ,'lunara-ai-20260820-local-review-v199-3'
  ,'lunara-ai-20260820-local-review-v200-2'
  ,'lunara-ai-20260820-local-review-v200-3'
  ,'lunara-ai-20260820-local-review-v200-4'
  ,'lunara-ai-20260820-local-review-v200-5'
  ,'lunara-ai-20260821-local-review-v200-6'
]);
const ASSET_MANIFEST = Object.freeze([
  { url:'/vendor/fflate-0.8.2.min.js', bytes:32665, sha256:'c3b34f2e9f5e74d4d7d64e01cac7a0c01954c6c406414d42185c7b53d6875ddf', types:['javascript','text/plain'] },
  { url:'/', bytes:33674, sha256:'7b213d66a160aeb203fcf3d50d8590847fbd0d32cdc23259b50559c76d29bbe9', types:['text/html'] },
  { url:'/offline.html', bytes:1139, sha256:'9ec9b36b24b20854c3ecdcc03be0e349ff66ebb001353980ac4e9e806cd2af8a', types:['text/html'] },
  { url:'/manifest.webmanifest', bytes:2274, sha256:'fe442b8268bdb63c6aabd9fcf67c27baa5b29a38a7a53623b45dfaaa436dfeb1', types:['application/manifest+json','application/json','application/octet-stream','text/plain'] },
  { url:'/vendor/lucide.min.js', bytes:357796, sha256:'3411692820cb8d47543f69496aa25fd603a358f4498046f41c508a5a3342210e', types:['javascript','text/plain'] },
  { url:'/diagnostics.js', bytes:3043, sha256:'2eeb9104e0656e3dbffa5179dc61add49cd28a64584ae4e51b1006905bb8aca9', types:['javascript','text/plain'] },
  { url:'/lunara-v96.css', bytes:32654, sha256:'fbcfe066af12d7e0b2568ca55832686f0a840286651989a9d1e12742287a740c', types:['text/css','text/plain'] },
  { url:'/iphone-paper-butterfly.jpg', bytes:213709, sha256:'1bc7b4434889f79ba290e2bfa3622125cc498522bdb2956d57e53b5c8da6f48b', types:['image/jpeg'] },
  { url:'/assets/runtime/vue-v129.js', bytes:144109, sha256:'173e4a0c8fa4c5af6ae229174a2841f0644f5b2a0c4f4cb5a49de418c15c17e4', types:['javascript','text/plain'] },
  { url:'/assets/runtime/vue-router-v129.js', bytes:24148, sha256:'502cadc52585b85c74996233084e7a0c8e35775264a961cf77cc04c2966116a4', types:['javascript','text/plain'] },
  { url:'/assets/runtime/vue-demi-v129.js', bytes:16, sha256:'7805785d55d097fc46ef69e738511f4a76c6298651b7caa11cca1c89d1c2d61e', types:['javascript','text/plain'] },
  { url:'/assets/runtime/pinia-v129.js', bytes:5612, sha256:'8d21ef4b8c6bb90344b5a078725627dc4bdc69a52a46b42a2d0c6aa9c0a55d04', types:['javascript','text/plain'] },
  { url:'/assets/runtime/supabase-v129.js', bytes:206178, sha256:'fdd149b3183cbc9b80e622a85d8960267a2160cc94d978bc19367f35e4041b87', types:['javascript','text/plain'] },
  { url:'/assets/lunara-app-v129.js', bytes:3321328, sha256:'11ff0b07d33a83958a1a158449731d07243000efeafc569b405498649a6d3ccb', types:['javascript','text/plain'] },
  { url:'/assets/lunara-app-v129.css', bytes:469082, sha256:'ccbe870ca72efcf6c54d7b031613af76e4b9d6cb8ac3f4ced856612888bf62ec', types:['text/css','text/plain'] },
  { url:'/assets/lunara-assistant-avatar.png', bytes:937445, sha256:'a69bb9010ac631f5844ecea3a0c6146852ea67a60cf1179363645d9863eba060', types:['image/png'] },
  { url:'/assets/features/music-v180.js', bytes:47772, sha256:'6ff096ec0945cd7677d74ae6d89872d59f166bb8a80394c686dde0849e29e39c', types:['javascript','text/plain'] },
  { url:'/assets/features/music-v180.css', bytes:38481, sha256:'feecbce7c8e5c1bebfd7404dc84d426673619179be6a055d1f2c400f8969f090', types:['text/css','text/plain'] },
  { url:'/assets/features/group-chat-v169.js', bytes:64097, sha256:'5c0493705cf5de6c8f1cc6cfe0efd3b386ee9462fb16f99bc8d955ed06fbd19b', types:['javascript','text/plain'] },
  { url:'/assets/features/group-chat-v169.css', bytes:23119, sha256:'2d7b49d8d7a9fb204539f3adc0078e65679d0b7b89a936943d864e1fcbaaa02a', types:['text/css','text/plain'] },
  { url:'/assets/features/offline-group-v1.js', bytes:49687, sha256:'1ab49f90f0befc2809e6c47720769588c1ae06098b2700a19e32de7ca47996ad', types:['javascript','text/plain'] },
  { url:'/assets/features/offline-group-v1.css', bytes:22320, sha256:'7a652b1e6c88fbb084d01fc298ca7bac1fff3d0abf3a7979ec0ee8fb1f0d84be', types:['text/css','text/plain'] },
  { url:'/assets/features/forum-v129.js', bytes:65351, sha256:'2d930574049de7c1d33f32d125d4b4044257f879079fc4eb9d946f28bf7c4b8a', types:['javascript','text/plain'] },
  { url:'/assets/features/forum-v198.js', bytes:67213, sha256:'12cefb2802d66f1a6fd31c0727bb06a6db37d4e3b7911bbcdacbdd1b68484c14', types:['javascript','text/plain'] },
  { url:'/assets/features/forum-v198.css', bytes:19888, sha256:'93bb4cb69c670268e7f80a9eee3785c40524e2856443ce2b7b3323d66ea04051', types:['text/css','text/plain'] },
  { url:'/assets/features/douyin-v198.js', bytes:28834, sha256:'95751708171b7834216570a8efc522a375da49cf75a6f1deae7753374e43275e', types:['javascript','text/plain'] },
  { url:'/assets/features/douyin-v198-review2.js', bytes:28864, sha256:'1fbdc8fa3420fb512ed100ef88a1b6508e3ace997b8e1d2b0b0c0ef9e65b82cc', types:['javascript','text/plain'] },
  { url:'/assets/features/douyin-v198.css', bytes:13480, sha256:'de431726f0e4fee5a232d951a5417a8931690d308ab2deeb92afef18ba43ed36', types:['text/css','text/plain'] },
  { url:'/assets/features/douyin-flower-cc0.mp4', bytes:1128375, sha256:'0cd83d944a6ca7822b4a8306cecc60a36e859b041f6702c6a1ad9ead78924451', types:['video/mp4'] },
  { url:'/assets/features/games-v129.js', bytes:78929, sha256:'01c6be346217ebead0a83b0dd3aefb20fce7d2adef31b0088e6b9f9b6a871267', types:['javascript','text/plain'] },
  { url:'/assets/features/tantan-v1.js', bytes:33867, sha256:'af26bcb1f1fe134e0e6002d949d26d539eb359095b4106210266b25a8368a221', types:['javascript','text/plain'] },
  { url:'/assets/features/tantan-v2.js', bytes:81827, sha256:'514b4ea784ef8b7251fe8d5ecc27d4c6ec552b3a51cdf32a7e945055a8570488', types:['javascript','text/plain'] },
  { url:'/assets/features/tantan-v2.css', bytes:26990, sha256:'307f230fc7167fcad600696165bb3b17c5c04e815ca2caa7fd36dafd9072ce9d', types:['text/css','text/plain'] },
  { url:'/assets/features/role-phone-v129.js', bytes:196251, sha256:'a56b5553d3178314490a681d2894da524b705b9cbfc5ce9dc0c472cbd1294999', types:['javascript','text/plain'] },
  { url:'/assets/features/role-social-v190.js', bytes:104865, sha256:'7c7fa246f066314d9dc3bd8498432ee7af609a049b4db2e7222c3c66541dbe2c', types:['javascript','text/plain'] },
  { url:'/assets/features/life-link-v173.js', bytes:33746, sha256:'276dcd543eed10508ce235e7921084696f51242003cd4e289d0648fad8764edd', types:['javascript','text/plain'] },
  { url:'/assets/features/together-v129.js', bytes:28144, sha256:'451e290f9deffc19b870638736d0b4d366f0677e878a264715ce0a2bc186c7a8', types:['javascript','text/plain'] },
  { url:'/assets/features/character-card-import-v152.js', bytes:17840, sha256:'7b44fa57af9c909e124d48c17ce3a69ff02132912cc1dc729a63b1a86c5afca7', types:['javascript','text/plain'] },
  { url:'/assets/features/text-call-v152.css', bytes:23073, sha256:'81313e85c2b8ff7a2635990c80ec5beac2255d2746336c001a819f01db570156', types:['text/css','text/plain'] },
  { url:'/assets/features/role-phone-modes-v152.css', bytes:2043, sha256:'c3ad458b62ab6dff7bcde776b41b4f269ab0c4705e9caf9eb9659abf296ce79c', types:['text/css','text/plain'] },
  { url:'/assets/features/phone-access-v159.css', bytes:44155, sha256:'f4462c26666ff40903ba9d3ae9c5bb6c2971b03200205555cf57b193fdf6f735', types:['text/css','text/plain'] },
  { url:'/assets/features/order-card-v152.css', bytes:2275, sha256:'89dbf6882df76974b1e92ba817a8bc95927e6be8a994a0a338695dd47914b932', types:['text/css','text/plain'] },
  { url:'/assets/features/identity-center-v167.js', bytes:17218, sha256:'a45b584bac4fde57c3bc139d1d3a47059660e4ba69090f8acc788bc957aef032', types:['javascript','text/plain'] },
  { url:'/assets/features/identity-center-v167.css', bytes:10140, sha256:'911a3115f9ff152f3b007e1d813d3d364994bee5ba581e7b8a083e628454017b', types:['text/css','text/plain'] },
  { url:'/assets/features/bookshelf-v189.css', bytes:37966, sha256:'9f5caddc58260b6bff3709b27de3a8bd32822ff866c7a7f575a97ec29d217153', types:['text/css','text/plain'] },
  { url:'/assets/features/fanfic-moye-v170.js', bytes:17731, sha256:'220f62ed93e735ba5fd4b7068057b29ffce7cc87645c3709d0148ac01e5dd492', types:['javascript','text/plain'] },
  { url:'/assets/features/moye-fanfic/index.html', bytes:3720, sha256:'057241b1fb1ad25ffa758e3f01eeb57aef0c02eeabb662904af931a191b7e7d4', types:['text/html'] },
  { url:'/assets/features/moye-fanfic/app.js', bytes:135728, sha256:'dbe02a02fbc7cf5a99e6bdff7b409ac5bee7de4b83555a8f42b1cff5b5e9a395', types:['javascript','text/plain'] },
  { url:'/assets/features/moye-fanfic/styles.css', bytes:53009, sha256:'1ab0c686ab0bd14a6d7865a38d0807d16325ca8692bdc7c65c290c159f1c23e0', types:['text/css','text/plain'] },
  { url:'/assets/features/moye-fanfic/vendor/lucide.min.js', bytes:357796, sha256:'3411692820cb8d47543f69496aa25fd603a358f4498046f41c508a5a3342210e', types:['javascript','text/plain'] },
  { url:'/assets/features/moye-fanfic/assets/character-1.jpg', bytes:66670, sha256:'4fe566eff0201e3364b36293e70db4c93ce29b596c20571b68852e0e8994f312', types:['image/jpeg'] },
  { url:'/assets/features/moye-fanfic/assets/character-2.jpg', bytes:128101, sha256:'ca429c796b77c49593d2d43c789eb0a1419600be1f6fcf0385951a133298269b', types:['image/jpeg'] },
  { url:'/assets/features/moye-fanfic/assets/character-3.jpg', bytes:54581, sha256:'fff7b190289fe5fe663ec13e4f8f83d3b7955d0dc530aa804c36783163c1f8e3', types:['image/jpeg'] },
  { url:'/assets/features/moye-fanfic/assets/character-4.jpg', bytes:168128, sha256:'824fd037597f236cccfd196e605bbae5e95ed8ce4155393a9d38f0fd2f77b9b5', types:['image/jpeg'] },
  { url:'/assets/features/moye-fanfic/assets/cover-1.jpg', bytes:211806, sha256:'140097d1be420ead37f998dbbdad83373d2752f644f183f389cc5bbefed16b35', types:['image/jpeg'] },
  { url:'/assets/features/moye-fanfic/assets/cover-2.jpg', bytes:429798, sha256:'6f9038d5f78b573c0ad51606a8a69afd32273bb9a89b3573930a9f3ca3a7e401', types:['image/jpeg'] },
  { url:'/assets/features/moye-fanfic/assets/cover-3.jpg', bytes:148002, sha256:'930e09ebdf0ef83dbdfb80944d9d1a0939f64d54e65c3d394f03d30cd56771fa', types:['image/jpeg'] },
  { url:'/assets/features/moye-fanfic/assets/cover-4.jpg', bytes:207730, sha256:'aa7aa1d117b8720527933e134d8fb8bf0f76602fe68ae3b23d38c76bcc37ef23', types:['image/jpeg'] },
  { url:'/assets/features/moye-fanfic/assets/cover-5.jpg', bytes:47801, sha256:'eaefcb5e5f264da260a558332d12eb5a31d0f525becf6e0fa6a7414f76055330', types:['image/jpeg'] },
  { url:'/assets/features/douyin-v192.css', bytes:1572, sha256:'2935ca73c21b75121e70f52a2dd486bbe7ac13640856b664fd5623c6f2586552', types:['text/css','text/plain'] }
]);
const CORE_ASSET_PATHS = new Set([
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/diagnostics.js',
  '/lunara-v96.css',
  '/iphone-paper-butterfly.jpg',
  '/assets/runtime/vue-v129.js',
  '/assets/runtime/vue-router-v129.js',
  '/assets/runtime/vue-demi-v129.js',
  '/assets/runtime/pinia-v129.js',
  '/assets/runtime/supabase-v129.js',
  '/vendor/fflate-0.8.2.min.js',
  '/assets/lunara-app-v129.js',
  '/assets/lunara-app-v129.css',
  '/assets/lunara-assistant-avatar.png',
  '/assets/features/character-card-import-v152.js',
  '/assets/features/life-link-v173.js',
  '/assets/features/text-call-v152.css',
  '/assets/features/phone-access-v159.css',
  '/assets/features/order-card-v152.css'
]);
const CORE_ASSET_MANIFEST = Object.freeze(ASSET_MANIFEST.filter(asset => CORE_ASSET_PATHS.has(asset.url)));
const OPTIONAL_ASSET_MANIFEST = Object.freeze(ASSET_MANIFEST.filter(asset => !CORE_ASSET_PATHS.has(asset.url)));
const RELEASE_PATHS = new Set(ASSET_MANIFEST.map(asset => asset.url));
let optionalWarmPromise=null;

function hex(bytes) {
  return [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2,'0')).join('');
}

function normalizeReleaseAssetBody(asset,body) {
  // Netlify appends a fixed hosting marker to every HTML response, including
  // offline and embedded feature documents. Remove only that signed-shape
  // marker before checking the local release manifest.
  // The old root-only guard (`asset?.url !== '/'`) intentionally no longer
  // excludes embedded HTML documents from this normalization.
  let text='';
  try { text=new TextDecoder().decode(body); } catch (_) { return body; }
  const marker=/<!--\s*This site is hosted on Netlify\. Anyone can build and deploy a site\s*\r?\n?\s*like this one for free:[^>]*\r?\n?\s*Netlify hosting facts for this site: static\/SSR served via Netlify Edge\.\s*-->\s*\r?\n?\s*<meta name="hosting-provider" content="Netlify">\s*\r?\n?\s*<meta name="netlify-deploy" content="https:\/\/netlify\.new\/\?utm_campaign=ai-legible&amp;utm_source=meta&amp;utm_medium=referral&amp;utm_id=[^"]+">\s*\r?\n?/i;
  if (!marker.test(text)) return body;
  return new TextEncoder().encode(text.replace(marker,'')).buffer;
}

async function fetchVerifiedAsset(asset) {
  const response = await fetch(new Request(asset.url,{cache:'reload',redirect:'follow'}));
  if (!response || !response.ok) throw new Error(`PWA_ASSET_HTTP ${asset.url} ${response?.status||0}`);
  const contentType = String(response.headers.get('content-type')||'').toLowerCase();
  if (!asset.types.some(type => contentType.includes(type))) throw new Error(`PWA_ASSET_TYPE ${asset.url} ${contentType||'missing'}`);
  const rawBody = await response.arrayBuffer();
  const body = contentType.includes('text/html') ? normalizeReleaseAssetBody(asset,rawBody) : rawBody;
  // HTML remains strict after the one known Netlify marker is removed. Any
  // other host mutation must fail installation instead of entering the cache.
  if (body.byteLength !== asset.bytes) throw new Error(`PWA_ASSET_LENGTH ${asset.url} ${body.byteLength}/${asset.bytes}`);
  const digest = hex(await crypto.subtle.digest('SHA-256',body));
  if (digest !== asset.sha256) throw new Error(`PWA_ASSET_HASH ${asset.url}`);
  const headers = new Headers(response.headers);
  headers.delete('content-encoding');
  headers.set('content-length',String(body.byteLength));
  headers.set('x-lunara-release',RELEASE_VERSION);
  return new Response(body,{status:200,statusText:'OK',headers});
}

async function notifyReleaseClients(type,detail={}) {
  const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of windows)client.postMessage({type,release:RELEASE_VERSION,build:RELEASE_BUILD,...detail});
}

async function cacheVerifiedAssets(cacheName,assets,concurrency=3) {
  const cache=await caches.open(cacheName);
  let nextAsset=0;
  const worker=async()=>{
    while(nextAsset<assets.length){
      const asset=assets[nextAsset++];
      await cache.put(asset.url,await fetchVerifiedAsset(asset));
    }
  };
  await Promise.all(Array.from({length:Math.min(Math.max(1,concurrency),assets.length||1)},()=>worker()));
  return cache;
}

async function writeReleaseMarker(metadata) {
  const body=JSON.stringify({release:RELEASE_VERSION,build:RELEASE_BUILD,...metadata});
  const response=()=>new Response(body,{headers:{'content-type':'application/json','cache-control':'no-store'}});
  await (await caches.open(CACHE_VERSION)).put(RELEASE_MARKER,response());
  if(metadata.optionalComplete===true)await (await caches.open(OPTIONAL_CACHE_VERSION)).put(RELEASE_MARKER,response());
}

async function installRelease() {
  try {
    await cacheVerifiedAssets(CACHE_VERSION,CORE_ASSET_MANIFEST,4);
    await writeReleaseMarker({complete:false,coreComplete:true,optionalComplete:false,coreAssets:CORE_ASSET_MANIFEST.length,totalAssets:ASSET_MANIFEST.length});
    await notifyReleaseClients('PWA_CORE_CACHE_READY',{assets:CORE_ASSET_MANIFEST.length,totalAssets:ASSET_MANIFEST.length});
  } catch (error) {
    await Promise.all([caches.delete(CACHE_VERSION),caches.delete(OPTIONAL_CACHE_VERSION)]);
    throw error;
  }
}

async function warmOptionalRelease() {
  if(optionalWarmPromise)return optionalWarmPromise;
  optionalWarmPromise=(async()=>{
    const marker=await (await caches.open(CACHE_VERSION)).match(RELEASE_MARKER);
    const metadata=await marker?.json().catch(()=>null);
    if(metadata?.optionalComplete===true)return true;
    await caches.delete(OPTIONAL_CACHE_VERSION);
    try{
      await cacheVerifiedAssets(OPTIONAL_CACHE_VERSION,OPTIONAL_ASSET_MANIFEST,2);
      await writeReleaseMarker({complete:true,coreComplete:true,optionalComplete:true,coreAssets:CORE_ASSET_MANIFEST.length,optionalAssets:OPTIONAL_ASSET_MANIFEST.length,totalAssets:ASSET_MANIFEST.length});
      await notifyReleaseClients('PWA_OPTIONAL_CACHE_READY',{assets:OPTIONAL_ASSET_MANIFEST.length,totalAssets:ASSET_MANIFEST.length});
      return true;
    }catch(error){await caches.delete(OPTIONAL_CACHE_VERSION);await writeReleaseMarker({complete:false,coreComplete:true,optionalComplete:false,coreAssets:CORE_ASSET_MANIFEST.length,totalAssets:ASSET_MANIFEST.length});throw error;}
  })().finally(()=>{optionalWarmPromise=null;});
  return optionalWarmPromise;
}

function releaseDelay(ms) {
  return new Promise(resolve => setTimeout(resolve,ms));
}

async function installAndActivateRelease() {
  await installRelease();
  const windows = await self.clients.matchAll({type:'window',includeUncontrolled:true});
  // A verified worker from a newer release takes over in one step. Waiting
  // behind every historical worker caused PWA users to refresh through v217,
  // v220, and v221 one at a time. Reinstalling the same release still waits.
  if (!self.registration.active || !windows.length || !activeWorkerMatchesRelease()) {
    // A legacy PWA shell may not understand RELEASE_UPDATE_READY. Let the
    // verified worker take over so the next navigation cannot remain pinned to
    // the old cache indefinitely.
    await self.skipWaiting();
    return;
  }
  // Keep the verified worker waiting while a page is open. The page shows a
  // stable update panel and explicitly asks the user before taking control.
  for (const client of windows) client.postMessage({type:'RELEASE_UPDATE_READY',release:RELEASE_VERSION,build:RELEASE_BUILD});
}

function activeWorkerMatchesRelease() {
  const scriptURL=String(self.registration.active?.scriptURL||'');
  if(!scriptURL)return false;
  try {
    const token=new URL(scriptURL).searchParams.get('v')||'';
    return token.includes(String(RELEASE_BUILD));
  } catch (_) {
    return scriptURL.includes(String(RELEASE_BUILD));
  }
}

async function activateRelease() {
  await cleanupOlderReleases();
  await self.clients.claim();
  const windows = await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for (const client of windows) client.postMessage({type:'RELEASE_ACTIVATED',release:RELEASE_VERSION,build:RELEASE_BUILD});
}

async function cleanupOlderReleases() {
  const keys = await caches.keys();
  await Promise.all(keys.map(async key => {
    if (key === CACHE_VERSION || key === OPTIONAL_CACHE_VERSION) return;
    if (LEGACY_CACHES.has(key)) { await caches.delete(key); return; }
    const versionMatch = key.match(/(?:^|-)v(\d+)(?:-|$)/i);
    if (versionMatch && Number(versionMatch[1]) < 252) { await caches.delete(key); return; }
    try {
      const marker = await (await caches.open(key)).match(RELEASE_MARKER);
      if (!marker) return;
      const metadata = await marker.json();
      if (Number(metadata.build||0) < RELEASE_BUILD) await caches.delete(key);
    } catch (_) {}
  }));
}

self.addEventListener('install',event => {
  event.waitUntil(installAndActivateRelease());
});

self.addEventListener('activate',event => {
  event.waitUntil(activateRelease());
});

self.addEventListener('message',event => {
  if (event.data?.type === 'GET_RELEASE_INFO') {
    event.ports?.[0]?.postMessage?.({release:RELEASE_VERSION,build:RELEASE_BUILD});
    return;
  }
  if (event.data?.type === 'FORCE_RELEASE_ACTIVATION') {
    event.waitUntil(self.skipWaiting());
    return;
  }
  if (event.data?.type === 'RELEASE_CLIENT_READY' && event.data?.release === RELEASE_VERSION) {
    if (event.source?.id) PREPARED_CLIENTS.add(event.source.id);
    return;
  }
  if (event.data?.type !== 'APP_READY' || event.data?.release !== RELEASE_VERSION) return;
  event.waitUntil((async()=>{await releaseDelay(1800);await cleanupOlderReleases();await warmOptionalRelease();await cleanupOlderReleases();})().catch(error=>console.warn('PWA optional cache warmup waiting for retry',error)));
});

async function releaseCache() {
  return caches.open(CACHE_VERSION);
}

async function cachedReleaseAsset(request,url) {
  try {
    const core=await caches.open(CACHE_VERSION),cachedCore=await core.match(url.pathname,{ignoreSearch:true});
    if(cachedCore instanceof Response)return cachedCore;
    const optional=await caches.open(OPTIONAL_CACHE_VERSION),cachedOptional=await optional.match(url.pathname,{ignoreSearch:true});
    if(cachedOptional instanceof Response)return cachedOptional;
  } catch (_) {}
  try {
    const network=await fetch(request);
    if(network instanceof Response)return network;
  } catch (_) {}
  const previous=await caches.match(request,{ignoreSearch:true}).catch(()=>null);
  if(previous instanceof Response)return previous;
  return new Response('',{status:504,headers:{'cache-control':'no-store'}});
}

async function cachedNavigation(request) {
  // A cache-first shell can strand an installed PWA on an old index.html:
  // that document contains the old release marker and therefore cannot
  // discover the current worker. Prefer the network for navigations so a
  // standalone window can reach the current update check; retain the cached
  // shell as the offline fallback.
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2800);
    try {
      const network = await fetch(request, {signal: controller.signal, cache:'no-store'});
      if (network instanceof Response && network.ok) return network;
    } finally { clearTimeout(timer); }
  } catch (_) {}
  let cache=null;
  try { cache=await releaseCache(); } catch (_) {}
  if(cache){
    const cached=await cache.match(request,{ignoreSearch:true}).catch(()=>null)
      || await cache.match('/',{ignoreSearch:true}).catch(()=>null)
      || await cache.match('/offline.html',{ignoreSearch:true}).catch(()=>null);
    if(cached instanceof Response)return cached;
  }
  try {
    const network=await fetch(request);
    if(network instanceof Response)return network;
  } catch (_) {}
  const fallback=await caches.match('/offline.html',{ignoreSearch:true}).catch(()=>null);
  if(fallback instanceof Response)return fallback;
  return new Response('<!doctype html><meta charset="utf-8"><title>LULU</title><h1>正在恢复应用</h1><p>请保持网络连接后重新加载。</p>',{status:503,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
}

async function cachedCoreAsset(request,url) {
  try {
    const cache=await releaseCache();
    const cached=await cache.match(url.pathname,{ignoreSearch:true});
    if(cached instanceof Response)return cached;
  } catch (_) {}
  try {
    const network=await fetch(request);
    if(network instanceof Response)return network;
  } catch (_) {}
  return new Response('',{status:504,headers:{'cache-control':'no-store'}});
}

async function networkWithOfflineFallback(request) {
  try {
    const network=await fetch(request);
    if(network instanceof Response)return network;
  }
  catch (_) {
  }
  const cached=await caches.match(request,{ignoreSearch:true}).catch(()=>null);
  if(cached instanceof Response)return cached;
  const fallback=await caches.match('/offline.html',{ignoreSearch:true}).catch(()=>null);
  if(fallback instanceof Response)return fallback;
  return new Response('',{status:504,headers:{'cache-control':'no-store'}});
}

self.addEventListener('fetch',event => {
  const {request} = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin') || url.pathname === '/sw.js') {
    event.respondWith(fetch(request));
    return;
  }
  if (RELEASE_PATHS.has(url.pathname)) {
    event.respondWith(cachedReleaseAsset(request,url));
    return;
  }
  // An iframe document also uses request.mode === "navigate". Resolve known
  // release documents first, otherwise the shell navigation would return /
  // and embed the LULU desktop inside the fanfic frame.
  if (request.mode === 'navigate') {
    event.respondWith(cachedNavigation(request));
    return;
  }
  event.respondWith(networkWithOfflineFallback(request));
});

self.addEventListener('notificationclick',event => {
  event.notification.close();
  const route = event.notification.data?.route || '/notifications';
  const target = new URL('/',self.location.origin);
  target.hash = route.startsWith('/') ? route : `/${route}`;
  event.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(async windows => {
      for (const client of windows) {
        if ('navigate' in client) await client.navigate(target.href);
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow ? clients.openWindow(target.href) : undefined;
    })
  );
});
