import {
  Heading,
  HStack,
  VStack,
  Button,
  Divider,
  Input,
  SimpleGrid,
  Avatar,
  Box,
  Image,
  Spacer,
  Tag,
  Text,
  Icon,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import { UnlockIcon, EmailIcon, PhoneIcon, StarIcon, InfoIcon } from "@chakra-ui/icons";
import { FaTwitter, FaMapMarkerAlt } from 'react-icons/fa'
import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../contexts/Web3Provider";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { ceramicCoreFactory } from "core/ceramic";
import { IPFS_GATEWAY } from "core/constants/index";
import axios from "axios";
import UnlockProfile from "components/Profile/Unlock";

const Home = () => {
  const { contracts } = useContext(Web3Context);
  const router = useRouter();
  const did = router.query.id;
  const [basicProfile, setBasicProfile] = useState();
  const [publicProfile, setPublicProfile] = useState();
  const [privateProfile, setPrivateProfile] = useState();
  const [decryptedData, setDecryptedData] = useState();
  const [canView, setCanView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get initial state from Ceramic
    (async () => {
      if (contracts) {
        const core = ceramicCoreFactory();
        const basicProfile = await core.get("basicProfile", did);
        console.log("basicProfile: ", basicProfile);
        setBasicProfile(basicProfile);
        const publicProfile = await core.get("publicProfile", did);
        console.log("publicProfile: ", publicProfile);
        setPublicProfile(publicProfile);
        const privateProfile = await core.get("privateProfile", did);
        console.log("privateProfile: ", privateProfile);
        setPrivateProfile(privateProfile);
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/unlock/${privateProfile.tokenId}`, {
            withCredentials: true,
          });
          if (response.status !== 200) {
            setLoading(false);
            return setCanView(false);
          }
          setCanView(true);
          setDecryptedData(response.data.decryptedProfile);
          setLoading(false);
        } catch (error) {
          setCanView(false);
          setLoading(false);
        }
      }
    })();
  }, [contracts]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
      <Box>
        <Image
          objectFit="cover"
          height="200px"
          width="100%"
          src={
            basicProfile && basicProfile.background
              ? IPFS_GATEWAY + basicProfile.background.original.src.split("//")[1]
              : "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80"
          }
          alt="cover"
        />
        <HStack width="100%" align="start">
          <VStack mt="-10" paddingX={4} paddingY={6} align="start" width="70%">
            <HStack width="100%">
              <Avatar src={basicProfile.image ? IPFS_GATEWAY + basicProfile.image.original.src.split("//")[1] : "https://source.unsplash.com/random"} size="2xl" />
              <VStack paddingX={4} paddingY={6} align="start">
                <Text fontSize="4xl">
                  {basicProfile.emoji} {basicProfile.name ? basicProfile.name : "Anonymous"}
                </Text>
                <Text fontSize="lg" color="purple.200">{basicProfile.description}</Text>
                <Text fontSize="lg" color="purple.200">
                  <Icon as={FaMapMarkerAlt} /> {basicProfile.homeLocation}, {basicProfile.residenceCountry}
                </Text>
              </VStack>
            </HStack>
            <Spacer mt={4} />
            <Heading fontSize="2xl" color="purple.200" pt={5}>
              Skills
            </Heading>
            {publicProfile && publicProfile.skillTags ? (
              <SimpleGrid columns={6} spacing={4}>
                {publicProfile.skillTags.map((skill, index) => (
                  <Tag
                    bgColor="purple.600"
                    textAlign="center"
                    size="lg"
                    key={index}
                    minWidth="fit-content"
                  >
                    {skill}
                  </Tag>
                ))}
              </SimpleGrid>
            ) : (
              <Text fontSize="lg" color="purple.200">N/A</Text>
            )}
            <Heading fontSize="2xl" color="purple.200" pt={10} pb={5}>
              Experiences
            </Heading>
            {publicProfile && publicProfile.experiences ?
              publicProfile.experiences.map((exp, index) => (
                <VStack paddingX={4} paddingY={2} align="start" key={index}>
                  <Heading fontSize="xl">
                    {exp}
                  </Heading>
                  <HStack width="100%" color="purple.200">
                    <Text fontSize="md">
                      COMPANY
                    </Text>
                    <Icon viewBox='0 0 100 100'>
                      <circle fill='currentColor' cx="50" cy="50" r="15"/>
                    </Icon>
                    <Text fontSize="md">
                      DURATION (START - END)
                    </Text>
                  </HStack>
                  <Text fontSize="md">
                    DESCRIPTION
                  </Text>
                  <Divider style={{marginTop: 40}} />
                </VStack>
              ))
            : (
              <Text fontSize="lg" color="purple.200">N/A</Text>
            )}
            <Heading fontSize="2xl" color="purple.200" pt={10} pb={5}>
              Education
            </Heading>
            {publicProfile && publicProfile.educations ?
              publicProfile.educations.map((education, index) => (
                <VStack paddingX={4} paddingY={2} align="start" key={index}>
                  <Heading fontSize="xl">
                    {education.school}
                  </Heading>
                  <HStack width="100%" color="purple.200">
                    <Text fontSize="md">
                      {education.title}
                    </Text>
                    <Icon viewBox='0 0 100 100'>
                      <circle fill='currentColor' cx="50" cy="50" r="15"/>
                    </Icon>
                    <Text fontSize="md">
                      {education.duration} ({education.start} - {education.end})
                    </Text>
                  </HStack>
                  <Text fontSize="md">
                    {education.description}
                  </Text>
                  <Divider style={{marginTop: 40}} />
                </VStack>
              ))
            : (
              <Text fontSize="lg" color="purple.200">N/A</Text>
            )}
          </VStack>
          <VStack mt="-14" paddingX={4} paddingY={6} align="start" width="30%">
          <Box border="2px solid" borderColor="purple.700" borderRadius="lg" width="100%">
            <VStack paddingX={4} paddingY={6} spacing={6} align="start">
              <Heading fontSize="2xl" color="purple.300">
                Contact Info
              </Heading>
              <Text fontSize="lg" color="purple.200">
                <InfoIcon /> {decryptedData ? decryptedData.firstname + " " + decryptedData.lastname : "Locked"}
              </Text>
              <Text fontSize="lg" color="purple.200">
                <EmailIcon /> {decryptedData ? decryptedData.email : "Locked"}
              </Text>
              <Text fontSize="lg" color="purple.200">
                <PhoneIcon /> {decryptedData ? decryptedData.phone : "Locked"}
              </Text>
              <Text fontSize="lg" color="purple.200">
                <Icon as={FaTwitter} /> {decryptedData ? decryptedData.twitter : "Locked"}
              </Text>
              {!canView && (
                <UnlockProfile privateProfile={privateProfile} />
              )}
            </VStack>
          </Box>
          </VStack>
        </HStack>
      </Box>
      )}
    </>
  );
};

export default Home;