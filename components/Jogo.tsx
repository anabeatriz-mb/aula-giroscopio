import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Accelerometer } from "expo-sensors";

const { width, height } = Dimensions.get("window");
const PLAYER_SIZE = 44;
const ORB_SIZE = 28;
const HEADER_HEIGHT = 100;

// ===== Configurações de Física =====
// Ajustadas para deixar a bola mais responsiva e divertida:
// - Mais aceleração = reage mais rápido à inclinação
// - Menos atrito = desliza mais, mas com um teto de velocidade pra não ficar
//   impossível de controlar
// - Dead zone filtra o "tremor" natural do acelerômetro parado
const FRICTION = 0.965; // Quanto mais perto de 1, mais ela desliza (inércia)
const ACCELERATION = 3.1; // Sensibilidade do movimento (antes: 1.8)
const MAX_SPEED = 14; // Velocidade máxima por frame, pra manter o controle
const DEAD_ZONE = 0.02; // Ignora ruído mínimo do sensor

const generateRandomPosition = () => {
  return {
    x: Math.random() * (width - ORB_SIZE - 20) + 10,
    y: Math.random() * (height - ORB_SIZE - HEADER_HEIGHT - 20) + HEADER_HEIGHT + 10,
  };
};

const getStartPosition = () => ({
  x: width / 2 - PLAYER_SIZE / 2,
  y: height / 2 - PLAYER_SIZE / 2,
});

export default function Jogo() {
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(getStartPosition());
  const [orbPosition, setOrbPosition] = useState(generateRandomPosition());

  // Refs para física sem re-renderizar a cada frame
  const velocity = useRef({ x: 0, y: 0 });
  const pos = useRef(getStartPosition());
  const accelData = useRef({ x: 0, y: 0 });

  // Animação de "pulso" ao coletar o orbe (feedback visual = mais divertido)
  const orbScale = useRef(new Animated.Value(1)).current;
  const scoreScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Accelerometer.setUpdateInterval(16); // ~60 FPS

    const subscription = Accelerometer.addListener((data) => {
      accelData.current = { x: data.x, y: data.y };
    });

    return () => subscription.remove();
  }, []);

  // Loop principal de animação e física
  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      const { x: ax, y: ay } = accelData.current;

      // Aplica dead zone pra evitar tremedeira quando o celular tá parado
      const inputX = Math.abs(ax) > DEAD_ZONE ? ax : 0;
      const inputY = Math.abs(ay) > DEAD_ZONE ? ay : 0;

      // 1. Aplica aceleração baseada na inclinação
      velocity.current.x += inputX * ACCELERATION;
      velocity.current.y -= inputY * ACCELERATION; // Invertido para bater com a tela

      // 2. Aplica atrito/inércia
      velocity.current.x *= FRICTION;
      velocity.current.y *= FRICTION;

      // 3. Limita a velocidade máxima (mantém controlável mesmo mais fluido)
      const speed = Math.hypot(velocity.current.x, velocity.current.y);
      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        velocity.current.x *= scale;
        velocity.current.y *= scale;
      }

      // 4. Atualiza posição acumulada
      let nextX = pos.current.x + velocity.current.x;
      let nextY = pos.current.y + velocity.current.y;

      // 5. Limites de Tela (Colisão com as paredes) com leve "quique"
      const minX = 0;
      const maxX = width - PLAYER_SIZE;
      const minY = HEADER_HEIGHT;
      const maxY = height - PLAYER_SIZE;
      const BOUNCE = 0.35; // pequeno quique nas bordas, mais gostoso que travar seco

      if (nextX < minX) {
        nextX = minX;
        velocity.current.x *= -BOUNCE;
      } else if (nextX > maxX) {
        nextX = maxX;
        velocity.current.x *= -BOUNCE;
      }

      if (nextY < minY) {
        nextY = minY;
        velocity.current.y *= -BOUNCE;
      } else if (nextY > maxY) {
        nextY = maxY;
        velocity.current.y *= -BOUNCE;
      }

      pos.current = { x: nextX, y: nextY };
      setPlayerPosition({ x: nextX, y: nextY });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Checagem de Colisão com o Orbe
  useEffect(() => {
    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;
    const orbCenterX = orbPosition.x + ORB_SIZE / 2;
    const orbCenterY = orbPosition.y + ORB_SIZE / 2;

    const dx = playerCenterX - orbCenterX;
    const dy = playerCenterY - orbCenterY;
    const distance = Math.hypot(dx, dy);

    if (distance < PLAYER_SIZE / 2 + ORB_SIZE / 2) {
      setOrbPosition(generateRandomPosition());
      setScore((prev) => prev + 1);
      triggerCollectFeedback();
    }
  }, [playerPosition, orbPosition]);

  const triggerCollectFeedback = () => {
    orbScale.setValue(0.4);
    Animated.spring(orbScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

    scoreScale.setValue(1.35);
    Animated.spring(scoreScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleRestart = () => {
    // Zera pontuação
    setScore(0);

    // Zera física e reposiciona o jogador no centro
    const start = getStartPosition();
    pos.current = start;
    velocity.current = { x: 0, y: 0 };
    setPlayerPosition(start);

    // Sorteia um novo orbe
    setOrbPosition(generateRandomPosition());
  };

  return (
    <View style={styles.container}>
      {/* Placar / Topbar */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>PONTUAÇÃO</Text>
          <Animated.Text
            style={[styles.scoreValue, { transform: [{ scale: scoreScale }] }]}
          >
            {score}
          </Animated.Text>
        </View>

        <Text style={styles.instructions}>Incline o celular para guiar a esfera</Text>

        <TouchableOpacity
          style={styles.restartButton}
          onPress={handleRestart}
          activeOpacity={0.7}
        >
          <Text style={styles.restartButtonText}>REINICIAR</Text>
        </TouchableOpacity>
      </View>

      {/* Orbe Coletável */}
      <Animated.View
        style={[
          styles.orb,
          {
            left: orbPosition.x,
            top: orbPosition.y,
            transform: [{ scale: orbScale }],
          },
        ]}
      />

      {/* Jogador */}
      <View
        style={[
          styles.player,
          {
            left: playerPosition.x,
            top: playerPosition.y,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0e15",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 10,
    backgroundColor: "rgba(19, 20, 31, 0.85)",
    paddingTop: 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreContainer: {
    flexDirection: "column",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6c7293",
    letterSpacing: 1.5,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#00f2fe",
  },
  instructions: {
    fontSize: 12,
    color: "#a0a5ba",
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  restartButton: {
    backgroundColor: "rgba(255, 42, 116, 0.15)",
    borderWidth: 1,
    borderColor: "#ff2a74",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  restartButtonText: {
    color: "#ff2a74",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  player: {
    position: "absolute",
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    backgroundColor: "#ff2a74",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#ff2a74",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 10,
  },
  orb: {
    position: "absolute",
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: "#00f2fe",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#00f2fe",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 8,
  },
});
