import React from 'react';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    console.log('📱 [Page] Index page initialized - Redirecting to onboarding');
  }, []);

  // Redirect to onboarding for now
  // TODO: Check auth state and redirect accordingly
  return <Redirect href="/onboarding" />;
}

