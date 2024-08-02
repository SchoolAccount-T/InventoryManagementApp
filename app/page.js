  'use client'
  import Image from "next/image";
  import { useState, useEffect } from "react";
  import {firestore} from '@/firebase';
  import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material';
  import { collection, deleteDoc, doc, getDoc, getDocs, setDoc,  query } from "firebase/firestore";

  const style = {
    position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'white',
      border: '0px solid #000',
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
  }

  export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const updateInventory = async () => {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({
          name:doc.id,
          ...doc.data(),
        })
      })
      setInventory(inventoryList)
      console.log(inventoryList)
    }

    const addItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
    }

    const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
        }
      }
      await updateInventory()
    }

    const clear = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      deleteDoc(docRef)
      await updateInventory()
    }

    useEffect(()=> {
      updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
      <Box
        width="100vw"
        height="100vh"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName.toLowerCase())
                  setItemName('')
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <Box border={'0px solid #808080'}>
          <Box
            width="800px"
            height="100px"
            borderBottom='5px solid #333'
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
            {inventory.map(({name, quantity}) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#ffffff'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  #{quantity}
                </Typography>
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
                <Button variant="contained" onClick={() => clear(name)}>
                  clear
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    )
  }
