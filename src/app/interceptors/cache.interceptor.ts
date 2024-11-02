import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCacheService } from '../services/http.cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private httpCache: HttpCacheService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Bypass caching for specific URLs and non-GET methods
    if (this.shouldBypassCache(request)) {
      return next.handle(request);
    }

    // Check for a cached response
    const cachedResponse = this.httpCache.get(request.url);
    if (cachedResponse) {
      console.log(`Cache hit for URL: ${request.url}`);
      this.httpCache.logCache();
      return of(cachedResponse);
    }

    // No cache hit, handle the request and cache the response
    return this.handleAndCacheResponse(request, next);
  }

  /**
   * Determines whether the cache should be bypassed based on the request.
   * @param request The HttpRequest object.
   * @returns True if the cache should be bypassed, false otherwise.
   */
  private shouldBypassCache(request: HttpRequest<unknown>): boolean {
    const bypassUrls = ['verify', 'login', 'refresh', 'resetpassword'];
    const isBypassUrl = bypassUrls.some((url) => request.url.includes(url));

    // Bypass cache for certain URLs or non-GET methods or download endpoints
    if (
      isBypassUrl ||
      request.method !== 'GET' ||
      request.url.includes('download')
    ) {
      // Optionally evict all cache for non-GET requests
      this.httpCache.evictAll();
      return true;
    }

    return false;
  }

  /**
   * Handles the request and caches the response if applicable.
   * @param request The HttpRequest object.
   * @param next The HttpHandler for forwarding the request.
   * @returns An Observable of HttpEvent.
   */
  private handleAndCacheResponse(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && request.method === 'GET') {
          console.log(`Caching response for URL: ${request.url}`);
          this.httpCache.put(request.url, event);
        }
      })
    );
  }
}
