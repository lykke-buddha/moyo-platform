import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/modals/LoginModal';
import ProfileSetupModal from '@/components/modals/ProfileSetupModal';

export default function GlobalAuthModal() {
    const { isLoginModalOpen, closeLoginModal, user, isLoggedIn } = useAuth();
    const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);

    // Trigger profile setup if logged in but no country set (assuming country is a required field for "complete" profile)
    useEffect(() => {
        if (isLoggedIn && user && !user.country) {
            // Short delay to ensure transition is smooth
            const timer = setTimeout(() => {
                setIsProfileSetupOpen(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn, user]);

    return (
        <>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={closeLoginModal}
            />
            <ProfileSetupModal
                isOpen={isProfileSetupOpen}
                onClose={() => setIsProfileSetupOpen(false)}
            />
        </>
    );
}
