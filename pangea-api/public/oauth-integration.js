// OAuth Integration for Register Page
// Add this script to your register page to connect Google and GitHub buttons to our API

(function() {
    'use strict';
    
    const API_BASE = 'http://localhost:8080';
    
    // Wait for DOM to be ready
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#10b981';
                break;
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f59e0b';
                break;
            default:
                notification.style.backgroundColor = '#3b82f6';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Handle Google OAuth
    async function handleGoogleAuth() {
        try {
            showNotification('Initiating Google authentication...', 'info');
            
            const response = await fetch(`${API_BASE}/auth/google`);
            const data = await response.json();
            
            if (data.success) {
                showNotification('Redirecting to Google...', 'info');
                window.location.href = data.auth_url;
            } else {
                showNotification(data.message || 'Google OAuth not configured', 'error');
            }
        } catch (error) {
            console.error('Google OAuth error:', error);
            showNotification('Failed to initiate Google authentication', 'error');
        }
    }
    
    // Handle GitHub OAuth
    async function handleGithubAuth() {
        try {
            showNotification('Initiating GitHub authentication...', 'info');
            
            const response = await fetch(`${API_BASE}/auth/github`);
            const data = await response.json();
            
            if (data.success) {
                showNotification('Redirecting to GitHub...', 'info');
                window.location.href = data.auth_url;
            } else {
                showNotification(data.message || 'GitHub OAuth not configured', 'error');
            }
        } catch (error) {
            console.error('GitHub OAuth error:', error);
            showNotification('Failed to initiate GitHub authentication', 'error');
        }
    }
    
    // Handle OAuth callback
    function handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (code && state) {
            const currentPath = window.location.pathname;
            
            if (currentPath.includes('google') || currentPath.includes('auth')) {
                handleGoogleCallback(code);
            } else if (currentPath.includes('github')) {
                handleGithubCallback(code);
            }
        }
    }
    
    async function handleGoogleCallback(code) {
        try {
            showNotification('Completing Google authentication...', 'info');
            
            const response = await fetch(`${API_BASE}/auth/google/callback?code=${code}`);
            const data = await response.json();
            
            if (data.success) {
                showNotification(`Welcome ${data.user.first_name}! Google authentication successful.`, 'success');
                // Redirect to dashboard or home page
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                showNotification(data.message || 'Google authentication failed', 'error');
            }
        } catch (error) {
            console.error('Google callback error:', error);
            showNotification('Failed to complete Google authentication', 'error');
        }
    }
    
    async function handleGithubCallback(code) {
        try {
            showNotification('Completing GitHub authentication...', 'info');
            
            const response = await fetch(`${API_BASE}/auth/github/callback?code=${code}`);
            const data = await response.json();
            
            if (data.success) {
                showNotification(`Welcome ${data.user.first_name}! GitHub authentication successful.`, 'success');
                // Redirect to dashboard or home page
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                showNotification(data.message || 'GitHub authentication failed', 'error');
            }
        } catch (error) {
            console.error('GitHub callback error:', error);
            showNotification('Failed to complete GitHub authentication', 'error');
        }
    }
    
    // Initialize OAuth integration
    function initOAuthIntegration() {
        // Wait for OAuth buttons to be available
        waitForElement('button', () => {
            const buttons = document.querySelectorAll('button');
            
            buttons.forEach(button => {
                const buttonText = button.textContent.toLowerCase();
                
                // Find Google button
                if (buttonText.includes('google') || buttonText.includes('continue with google')) {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleGoogleAuth();
                    });
                    console.log('Google OAuth button connected');
                }
                
                // Find GitHub button
                if (buttonText.includes('github') || buttonText.includes('continue with github')) {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleGithubAuth();
                    });
                    console.log('GitHub OAuth button connected');
                }
            });
        });
        
        // Handle OAuth callback if we're on a callback page
        if (window.location.search.includes('code=')) {
            handleOAuthCallback();
        }
    }
    
    // Start integration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOAuthIntegration);
    } else {
        initOAuthIntegration();
    }
    
    // Expose functions globally for manual integration
    window.OAuthIntegration = {
        handleGoogleAuth,
        handleGithubAuth,
        showNotification
    };
    
    console.log('OAuth Integration loaded successfully');
})(); 