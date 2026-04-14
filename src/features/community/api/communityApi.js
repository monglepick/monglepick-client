/**
 * 커뮤니티(Community) API 모듈.
 *
 * 게시글의 CRUD 관련 HTTP 요청을 처리한다.
 * 리뷰 관련 API는 features/review/api/reviewApi.js로 분리되었다.
 * axios interceptor가 JWT 토큰을 자동 주입하며, 비인증 상태에서도 조회는 가능하다.
 */

import api from '../../../shared/api/axiosInstance';
import { COMMUNITY_ENDPOINTS } from '../../../shared/constants/api';

function normalizePost(post) {
  if (!post) return post;
  const nickname =
    (typeof post.author === 'string' ? post.author : post.author?.nickname) ||
    post.authorNickname  ||
    post.userNickname    ||
    post.nickname        ||
    null;
  return {
    ...post,
    author: { nickname },
  };
}

export async function getPosts({ page = 1, size = 20, sort = 'latest', category, keyword } = {}) {
  const zeroBasedPage = Math.max(0, page - 1);

  const params = { page: zeroBasedPage, size, sort };

  if (category && category !== 'all') {
    params.category = category;
  }

  if (keyword && keyword.trim()) {
    params.keyword = keyword.trim(); // ✅ keyword 추가
  }

  const pageData = await api.get(COMMUNITY_ENDPOINTS.POSTS, { params });

  const filtered = (pageData?.content ?? []).filter(
    (p) => p.category !== 'PLAYLIST_SHARE'
  );
  return {
    posts: filtered.map(normalizePost),
    total: pageData?.totalElements ?? 0,
    page: (pageData?.number ?? 0) + 1,
    totalPages: pageData?.totalPages ?? 0,
  };
}

export async function getPostDetail(postId) {
  const data = await api.get(COMMUNITY_ENDPOINTS.POST_DETAIL(postId));
  return normalizePost(data);
}

export async function createPost({ title, content, category = 'general' }) {
  return api.post(COMMUNITY_ENDPOINTS.CREATE_POST, { title, content, category });
}

export async function updatePost(postId, { title, content, category }) {
  return api.put(COMMUNITY_ENDPOINTS.UPDATE_POST(postId), { title, content, category });
}

export async function deletePost(postId) {
  return api.delete(COMMUNITY_ENDPOINTS.UPDATE_POST(postId));
}

export async function togglePostLike(postId) {
  return api.post(COMMUNITY_ENDPOINTS.POST_LIKE(postId));
}

export async function getSharedPlaylists({ page = 1, size = 15 } = {}) {
  const data = await api.get(COMMUNITY_ENDPOINTS.SHARED_PLAYLISTS, {
    params: { page: Math.max(0, page - 1), size },
  });
  console.log('[getSharedPlaylists] raw data:', data);
  return {
    posts: data?.content ?? [],
    total: data?.totalElements ?? 0,
    page: (data?.number ?? 0) + 1,
    totalPages: data?.totalPages ?? 0,
  };
}

export async function sharePlaylist({ title, content, playlistId }) {
  return api.post(COMMUNITY_ENDPOINTS.CREATE_POST, {
    title,
    content,
    category: 'PLAYLIST_SHARE',
    playlistId,
  });
}

export async function uploadImages(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const data = await api.post('/api/v1/images/upload', formData, {
    headers: { 'Content-Type': undefined },
  });
  return data.urls;
}