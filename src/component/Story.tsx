import { Avatar, Box, Image, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState, MouseEvent } from "react";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";

interface StoryData {
  id: number;
  image: string;
  duration: number;
}

const Story: React.FC = () => {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasOpened, setHasOpened] = useState<boolean>(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/stories");
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    if (stories.length === 0) return;

    const timer = setTimeout(() => {
      nextStory();
    }, stories[currentStoryIndex]?.duration || 5000); 

    return () => clearTimeout(timer);
  }, [currentStoryIndex, stories]);

  const nextStory = () => {
    if ((currentStoryIndex + 1) % stories.length === 0) {
      onClose();
    } else {
      setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }
  };

  const prevStory = () => {
    setCurrentStoryIndex(
      (prevIndex) => (prevIndex - 1 + stories.length) % stories.length
    );
  };

  const openModal = () => {
    setHasOpened(true);
    onOpen();
  };

  return (
    <>
      <Box w="100px" h="100px" onClick={openModal}>
        {stories.length > 0 && <Avatar src={stories[0].image} />}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalBody display="flex" alignItems="center" justifyContent="center">
            <Box position="absolute" left="0" zIndex="1" cursor="pointer" p={2}>
              <GrLinkPrevious size="2em" onClick={(e) => { prevStory(); }} />
            </Box>
            {stories.length > 0 && (
              <Image src={stories[currentStoryIndex].image} maxH="100vh" maxW="100vw" />
            )}
            <Box position="absolute" right="0" zIndex="1" cursor="pointer" p={2}>
              <GrLinkNext size="2em" onClick={(e) => { nextStory(); }} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Story;
