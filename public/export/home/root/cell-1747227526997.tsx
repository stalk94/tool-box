export default function Cell() {
    return (
        <>
            <video
                src={''}
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    maxHeight: 114,
                    objectFit: 'contain'
                }}
                controls
                data-source="src"
                data-type="Video"
            />
        </>
    );
}
