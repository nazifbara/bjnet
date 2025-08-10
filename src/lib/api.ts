import type { FormData } from './types';
import { API_BASE_URL } from './constants';

const API_KEY = 'bjnet_web_dev';

async function apiFetch<T>(
	endpoint: string,
	formData: FormData,
	includeLocation = true
): Promise<T> {
	let url = `${API_BASE_URL}/${endpoint}?startDate=${formData.startDate}&endDate=${formData.endDate}`;

	if (includeLocation) {
		if (formData.country) url += `&country=${formData.country}`;
		if (formData.region) url += `&region=${formData.region}`;
		if (formData.city) url += `&city=${formData.city}`;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': API_KEY
		}
	});

	if (response.status === 404) {
		throw new Error('No data found for the given criteria');
	}
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

interface ServiceLevelResponse {
	session_count: number;
	download_mbps_distribution: Record<string, string>;
	upload_mbps_distribution: Record<string, string>;
}

export async function fetchServiceLevelData(formData: FormData): Promise<ServiceLevelResponse> {
	return apiFetch<ServiceLevelResponse>('serviceLevel', formData);
}

interface RTTResponse {
	session_count: number;
	rtt_distribution_ms: Record<string, string>;
}

export async function fetchRTTData(formData: FormData): Promise<RTTResponse> {
	return apiFetch<RTTResponse>('rtt', formData);
}

interface AckDelayResponse {
	ack_count: number;
	ack_delay_distribution_ms: Record<string, string>;
}

export async function fetchAckDelayData(formData: FormData): Promise<AckDelayResponse> {
	return apiFetch<AckDelayResponse>('ackDelay', formData);
}

interface StreamResponse {
	session_count: number;
	avg_concurrency_overall: number;
	stream_concurrency_distribution: Record<string, string>;
}

export async function fetchStreamData(formData: FormData): Promise<StreamResponse> {
	return apiFetch<StreamResponse>('streams', formData);
}

interface BandwidthResult {
	isp: string;
	sessions: number;
	upload_kbps: number;
	download_kbps: number;
}

interface BandwidthResponse {
	results: BandwidthResult[];
}

export async function fetchBandwithData(formData: FormData): Promise<BandwidthResponse> {
	return apiFetch<BandwidthResponse>('bandwidthByISP', formData, false);
}
