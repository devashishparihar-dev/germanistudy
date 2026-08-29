import { useEffect } from 'react';

export function useSEO({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  noindex = false,
}) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = `${title} | GermaniStudy`;
    }

    // Helper to safely update or create meta tags
    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Update Canonical URL
    if (canonicalUrl) {
      let canonicalElement = document.querySelector('link[rel="canonical"]');
      if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalElement);
      }
      // Ensure no trailing slashes in canonical URL as per policy
      const cleanUrl = canonicalUrl.endsWith('/') ? canonicalUrl.slice(0, -1) : canonicalUrl;
      canonicalElement.setAttribute('href', cleanUrl);
    }

    // 4. Update Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', ogTitle || title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', ogDescription || description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);

    // 5. Update Robots Noindex
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', 'noindex');
    } else if (robotsTag && robotsTag.getAttribute('content') === 'noindex') {
      // Remove noindex if switching from a noindex page to an indexed one
      robotsTag.remove();
    }
  }, [title, description, canonicalUrl, ogTitle, ogDescription, ogImage, noindex]);
}
