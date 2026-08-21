import { api } from './api';
import { LISTING_KINDS } from '@/config/listingKinds';

function base(kind) {
  return LISTING_KINDS[kind].apiBase;
}

export async function fetchListings(kind, params = {}) {
  const { data } = await api.get(`/${base(kind)}`, { params });
  return data.data;
}

export async function fetchListing(kind, id) {
  const key = kind === 'job' ? 'job' : 'internship';
  const { data } = await api.get(`/${base(kind)}/${id}`);
  return data.data[key];
}

export async function createListing(kind, payload) {
  const key = kind === 'job' ? 'job' : 'internship';
  const { data } = await api.post(`/${base(kind)}`, payload);
  return data.data[key];
}

export async function updateListing(kind, id, payload) {
  const key = kind === 'job' ? 'job' : 'internship';
  const { data } = await api.patch(`/${base(kind)}/${id}`, payload);
  return data.data[key];
}

export async function changeListingStatus(kind, id, status) {
  const key = kind === 'job' ? 'job' : 'internship';
  const { data } = await api.patch(`/${base(kind)}/${id}/status`, { status });
  return data.data[key];
}

export async function applyToListing(kind, id) {
  const { data } = await api.post(`/${base(kind)}/${id}/apply`);
  return data.data.application;
}

export async function bookmarkListing(kind, id) {
  await api.post(`/${base(kind)}/${id}/bookmark`);
}

export async function unbookmarkListing(kind, id) {
  await api.delete(`/${base(kind)}/${id}/bookmark`);
}

export async function fetchBookmarked(kind) {
  const key = kind === 'job' ? 'jobs' : 'internships';
  const { data } = await api.get(`/${base(kind)}/me/bookmarked`);
  return data.data[key];
}

export async function fetchApplicants(kind, id) {
  const { data } = await api.get(`/${base(kind)}/${id}/applicants`);
  return data.data.applications;
}
