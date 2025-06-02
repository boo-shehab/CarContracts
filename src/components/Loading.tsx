import MoonLoader from 'react-spinners/MoonLoader';

const primaryColor = '#1976d2';

const Loading = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'white',
      zIndex: 9999,
    }}
  >
    <MoonLoader color={primaryColor} size={60} />
  </div>
);

export default Loading;
