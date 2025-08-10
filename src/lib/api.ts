import type { FormData } from './types';
import { API_BASE_URL } from './constants';

export async function fetchServiceLevelData(formData: FormData) {
	let url = `${API_BASE_URL}/serviceLevel?startDate=${formData.startDate}&endDate=${formData.endDate}`;
	if (formData.country) {
		url += `&country=${formData.country}`;
	}
	if (formData.region) {
		url += `&region=${formData.region}`;
	}
	if (formData.city) {
		url += `&city=${formData.city}`;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': 'bjnet_web_dev'
		}
	});

	if (response.status === 404) {
		throw new Error('No data found for the given criteria');
	}
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return (await response.json()) as {
		session_count: number;
		download_mbps_distribution: Record<string, string>;
		upload_mbps_distribution: Record<string, string>;
	};
}

export async function fetchRTTData(formData: FormData) {
	let url = `${API_BASE_URL}/rtt?startDate=${formData.startDate}&endDate=${formData.endDate}`;
	if (formData.country) {
		url += `&country=${formData.country}`;
	}
	if (formData.region) {
		url += `&region=${formData.region}`;
	}
	if (formData.city) {
		url += `&city=${formData.city}`;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': 'bjnet_web_dev'
		}
	});

	if (response.status === 404) {
		throw new Error('No data found for the given criteria');
	}
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return (await response.json()) as {
		session_count: number;
		rtt_distribution_ms: Record<string, string>;
	};
}

export async function fetchAckDelayData(formData: FormData) {
	let url = `${API_BASE_URL}/ackDelay?startDate=${formData.startDate}&endDate=${formData.endDate}`;
	if (formData.country) {
		url += `&country=${formData.country}`;
	}
	if (formData.region) {
		url += `&region=${formData.region}`;
	}
	if (formData.city) {
		url += `&city=${formData.city}`;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': 'bjnet_web_dev'
		}
	});

	if (response.status === 404) {
		throw new Error('No data found for the given criteria');
	}
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return (await response.json()) as {
		ack_count: number;
		ack_delay_distribution_ms: Record<string, string>;
	};
}

export async function fetchStreamData(formData: FormData) {
	let url = `${API_BASE_URL}/streams?startDate=${formData.startDate}&endDate=${formData.endDate}`;
	if (formData.country) {
		url += `&country=${formData.country}`;
	}
	if (formData.region) {
		url += `&region=${formData.region}`;
	}
	if (formData.city) {
		url += `&city=${formData.city}`;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': 'bjnet_web_dev'
		}
	});

	if (response.status === 404) {
		throw new Error('No data found for the given criteria');
	}
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return (await response.json()) as {
		session_count: number;
		avg_concurrency_overall: number;
		stream_concurrency_distribution: Record<string, string>;
	};
}

export async function fetchBandwithData(formData: FormData) {
	const url = `${API_BASE_URL}/bandwidthByISP?startDate=${formData.startDate}&endDate=${formData.endDate}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': 'bjnet_web_dev'
		}
	});

	if (response.status === 404) {
		throw new Error('No data found for the given criteria');
	}
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return (await response.json()) as {
		results: { isp: string; sessions: number; upload_kbps: number; download_kbps: number }[];
	};
}
