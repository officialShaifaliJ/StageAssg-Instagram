import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Container,
  Heading,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";

interface StoryData {
  name: string;
  id: number;
  image: string[];
  duration: number;
}

const Story: React.FC = () => {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [hasOpened, setHasOpened] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get<StoryData[]>(
          "http://localhost:8080/api/stories"
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  const openModal = (index: number) => {
    setCurrentStoryIndex(index);
    setCurrentImageIndex(0);
    setHasOpened(true);
    onOpen();
  };

  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    const timer = setTimeout(() => {
      nextImage();
    }, stories[currentStoryIndex].duration);

    return () => clearTimeout(timer);
  }, [currentImageIndex, isOpen, currentStoryIndex]);

  const nextImage = () => {
    const nextIndex = currentImageIndex + 1;
    if (nextIndex < stories[currentStoryIndex].image.length) {
      setCurrentImageIndex(nextIndex);
    } else {
      nextStory();
    }
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex - 1;
    if (prevIndex >= 0) {
      setCurrentImageIndex(prevIndex);
    } else {
      prevStory();
    }
  };

  const nextStory = () => {
    const nextIndex = (currentStoryIndex + 1) % stories.length;
    if (nextIndex === 0) {
      onClose();
    } else {
      setCurrentStoryIndex(nextIndex);
      setCurrentImageIndex(0);
    }
  };

  const prevStory = () => {
    const prevIndex = (currentStoryIndex - 1 + stories.length) % stories.length;
    setCurrentStoryIndex(prevIndex);
    setCurrentImageIndex(0);
  };

  return (
    <>
      <Container display="flex" flexDirection="row">
        <Image src="https://img.freepik.com/premium-vector/instagram-logo-icon_628407-1924.jpg?w=826" />
      </Container>
      <Box display="flex" flexDirection="row" gap="1pc" mx="1pc">
        {stories.map((story, index) => (
          <Avatar
            key={story.id}
            src={story.image[0]}
            w="80px"
            h="80px"
            onClick={() => openModal(index)}
            border={hasOpened ? "4px solid lightgrey" : "4px solid skyblue"}
            borderColor={hasOpened ? "gray.400" : "blue.500"}
            borderRadius="full"
            cursor="pointer"
          />
        ))}
      </Box>

      {isOpen && stories.length > 0 && (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent bg="black">
            <Flex alignItems="center" justifyContent="flex-start" gap='2' p={4}>
              <Avatar src={stories[currentStoryIndex].image[0]} />
              <Heading color="white" size="sm">
                {stories[currentStoryIndex].name}
              </Heading>
            </Flex>
            <ModalBody display="flex" alignItems="center" justifyContent="center">
              <Box position="absolute" left="0" zIndex="1" cursor="pointer" p={2}>
                <GrLinkPrevious
                  size="2em"
                  onClick={(e) => {
                    prevImage();
                  }}
                />
              </Box>
              <Image
                src={stories[currentStoryIndex].image[currentImageIndex]}
                maxH="100vh"
                maxW="100vw"
              />
              <Box position="absolute" right="0" zIndex="1" cursor="pointer" p={2}>
                <GrLinkNext
                  size="2em"
                  onClick={(e) => {
                    nextImage();
                  }}
                />
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Story;
