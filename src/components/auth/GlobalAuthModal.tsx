'use client';

import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/modals/LoginModal';

export default function GlobalAuthModal() {
    const { isLoginModalOpen, closeLoginModal } = useAuth();

    return (
        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLoginModal}
        />
    );
}
