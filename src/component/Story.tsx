import { Avatar, Box, Image, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Container } from "@chakra-ui/react";
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
    <Container display='flex' flexDirection='row'>
        {/* <Image src='https://img.freepik.com/free-psd/social-media-logo-design_23-2151320963.jpg?t=st=1716542783~exp=1716546383~hmac=527914741829c37988e9d2bfaf16970a11492a89b1e48f08eb6a05c5fc3d493a&w=740'/> */}
        <Image src='https://img.freepik.com/premium-vector/instagram-logo-icon_628407-1924.jpg?w=826'/>
    </Container>
      <Box w="100px" h="100px" onClick={openModal} m='1pc' display='flex' flexDirection={'row'} gap='1pc'> 
        {stories.length > 0 && <Avatar src={stories[0].image}  w="80px" 
        h="80px" 
        onClick={openModal} 
        border={hasOpened ? "4px solid lightgrey" : "4px solid skyblue"}
        borderColor={hasOpened ? "gray.400" : "blue.500"} 
        borderRadius="full"
        cursor="pointer"/>}

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
