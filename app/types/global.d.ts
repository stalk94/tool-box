

declare global {
    interface Window {
        ROUTER?: ReturnType<typeof import('next/navigation')['useRouter']>;
    }
}

  