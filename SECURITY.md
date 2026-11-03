# Security policy

Deploybase is a static site: it has no server, no accounts and no stored visitor data.

## Reporting a problem

If you find a security problem, please use GitHub's private reporting: open the **Security** tab of this repository and choose **Report a vulnerability**. Please do not post details in a public issue.

## What is in place

- A Content Security Policy on every page that allows this site's own scripts, styles, fonts and images only.
- No third-party requests and no analytics.
- Every external link opens with `rel="noopener noreferrer"`.
- GitHub Actions workflows use least-privilege permissions, CodeQL scans the JavaScript weekly, and Dependabot keeps the actions up to date.

## Limits of the host

GitHub Pages cannot send custom HTTP response headers, so headers such as `Strict-Transport-Security`, `X-Content-Type-Options` and `frame-ancestors` cannot be set by this site. The policy above is applied with a `<meta>` tag, which browsers honour for most directives but not `frame-ancestors`.
