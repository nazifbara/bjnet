import type { FormData } from './types';
import { API_BASE_URL } from './constants';

const API_KEY = 'bjnet_web_dev';

async function apiFetch<T>(
	endpoint: string,
	formData: FormData,
	includeLocation = true
): Promise<T | null> {
	let url = `${API_BASE_URL}/${endpoint}?startDate=${formData.startDate}&endDate=${formData.endDate}`;

	try {
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
			return null;
		}
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

interface ServiceLevelResponse {
	session_count: number;
	download_mbps_distribution: Record<string, string>;
	upload_mbps_distribution: Record<string, string>;
}

export async function fetchServiceLevelData(
	formData: FormData
): Promise<ServiceLevelResponse | null> {
	return apiFetch<ServiceLevelResponse>('serviceLevel', formData);
}

interface RTTResponse {
	session_count: number;
	rtt_distribution_ms: Record<string, string>;
}

export async function fetchRTTData(formData: FormData): Promise<RTTResponse | null> {
	return apiFetch<RTTResponse>('rtt', formData);
}

interface PacketLossResponse {
	session_count: number;
	packet_loss_distribution: Record<string, string>;
}

export async function fetchPacketLossData(formData: FormData): Promise<PacketLossResponse | null> {
	return apiFetch<PacketLossResponse>('packetLoss', formData);
}

interface RetransmissionResponse {
	session_count: number;
	total_packets_lost: number;
	avg_packets_lost_per_session: number;
	loss_trigger_distribution: Record<string, string>;
	packet_loss_rate_distribution: Record<string, string>;
}

export async function fetchRetransmissionData(
	formData: FormData
): Promise<RetransmissionResponse | null> {
	return apiFetch<RetransmissionResponse>('retransmissions', formData);
}

interface AckDelayResponse {
	ack_count: number;
	ack_delay_distribution_ms: Record<string, string>;
}

export async function fetchAckDelayData(formData: FormData): Promise<AckDelayResponse | null> {
	return apiFetch<AckDelayResponse>('ackDelay', formData);
}

interface StreamResponse {
	session_count: number;
	avg_concurrency_overall: number;
	stream_concurrency_distribution: Record<string, string>;
}

export async function fetchStreamData(formData: FormData): Promise<StreamResponse | null> {
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

export async function fetchBandwithData(formData: FormData): Promise<BandwidthResponse | null> {
	return apiFetch<BandwidthResponse>('bandwidthByISP', formData, false);
}
