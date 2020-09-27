import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

const scopes = [
	'playlist-modify-private',
	'playlist-modify-public',
	'playlist-read-collaborative',
	'playlist-read-collaborative',
	'playlist-read-private',
	'user-library-read',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'user-read-playback-state',
	'user-read-recently-played',
];

export class SpotifyOAuth2Api implements ICredentialType {
	name = 'spotifyOAuth2Api';
	extends = [
		'oAuth2Api',
	];
	displayName = 'Spotify OAuth2 API';
	properties = [
		{
			displayName: 'Spotify Server',
			name: 'server',
			type: 'hidden' as NodePropertyTypes,
			default: 'https://api.spotify.com/',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden' as NodePropertyTypes,
			default: 'https://accounts.spotify.com/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden' as NodePropertyTypes,
			default: 'https://accounts.spotify.com/api/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden' as NodePropertyTypes,
			default: encodeURIComponent(scopes.join(' ')),
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden' as NodePropertyTypes,
			default: 'header',
		}
	];
}
