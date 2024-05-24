// import './App.css';
import React, { useState } from "react";
import Story from "./component/Story";
import { Box, Image, Text, Button } from "@chakra-ui/react";

function App() {
  const [showStory, setShowStory] = useState(false);

  const handleStartClick = () => {
    setShowStory(true);
  };

  return (
    <div className="App">
      {!showStory ? (
        <Box w={{ sm: "70%", base: "100%" }} h="100%">
          <Image
            h="100vh"
            position={'absolute'}
            src="https://img.freepik.com/free-vector/instagram-logo_1199-122.jpg?t=st=1716540975~exp=1716544575~hmac=e5e988ecc86e3595420b6d3d6c1d97d3b956ee7f5a231138812771aab73d7a22&w=740"
          />
          <Button onClick={handleStartClick} position='relative'>Let's Start</Button>
        </Box>
      ) : (
        <Story />
      )}
    </div>
  );
}

export default App;
