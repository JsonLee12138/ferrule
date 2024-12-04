import React, { Suspense, useEffect } from 'react';
import { Canvas, extend, useLoader, type Object3DNode } from '@react-three/fiber';
import { GridHelper, TextureLoader } from 'three';
import { OrbitControls, useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Model = () => {
  const { scene: model, animations } = useLoader(GLTFLoader, '/assets/models/man/scene.gltf');
  const { ref, mixer, names, actions, clips } = useAnimations(animations);
  // const pants = useLoader(TextureLoader, '/assets/images/pants.png');
  // const polo = useLoader(TextureLoader, '/assets/images/polo.png');
  // const skeleton = model.getObjectByName('skeletonRoot');
  useEffect(() => {
    // const names: string[] = [];
    model.traverse((obj) => {
      // console.log(obj, 'item')
      if ((obj as any).isBone) {
        // names.push(obj.name);
        console.log(obj.name);
        if (obj.name === 'CC_Base_L_Upperarm_050') {
          obj.rotation.z = -Math.PI / 2.1;
          obj.rotation.y = -Math.PI / 26;
          obj.translateY(2);
        }
        if (obj.name === 'CC_Base_R_Upperarm_078') {
          obj.rotation.z = Math.PI / 2.1;
          obj.rotation.y = Math.PI / 26;
          obj.translateY(2);
        }
        if(obj.name === 'CC_Base_Waist_033'){
          // obj.customDepthMaterial.map
        }
      }
    });
    console.log(names, clips, actions);
  }, []);
  // console.log(model, '>>>', skeleton);
  return <primitive object={model} scale={1} />;
};

class CustomElement extends GridHelper {}

extend({ CustomElement });

declare module '@react-three/fiber' {
  interface ThreeElements {
    customElement: Object3DNode<CustomElement, typeof CustomElement>;
  }
}

function ThreeDemo() {

  useEffect(()=> {
    // texture.
  }, [])
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 75 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Model />
        {/* <mesh position={[0, 0.445, 0.2]} scale={[.6, .7, 1]}>
          <planeGeometry args={[1, 1.5]} />
          <meshStandardMaterial map={pants} transparent={true} />
        </mesh>
        <mesh position={[0, 1.2, 0.21]} scale={[.6, .5, 1]}>
          <planeGeometry args={[1, 1.5]} />
          <meshStandardMaterial map={polo} transparent={true} />
        </mesh> */}
        <OrbitControls />
        <customElement />
      </Suspense>
    </Canvas>
  );
}

export default ThreeDemo;
