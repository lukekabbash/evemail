import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

const ParticleBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 30,
        particles: {
          color: {
            value: '#333333',
          },
          links: {
            color: '#333333',
            distance: 150,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.2,
            direction: 'none',
            random: false,
            straight: false,
            outModes: {
              default: 'out',
            },
          },
          number: {
            density: {
              enable: true,
              area: 1500,
            },
            value: 30,
          },
          opacity: {
            value: 0.15,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 2 },
          },
        },
        detectRetina: false,
        fullScreen: false,
        pauseOnBlur: true,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleBackground; 