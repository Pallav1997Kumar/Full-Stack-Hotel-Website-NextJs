'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/redux store/store.js'
import { storePersistance, persistor } from '@/redux store/storePersistance.js'
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({ children }) {
  // const storeRef = useRef();
  // if (!storeRef.current) {
  //   // Create the store instance the first time this renders
  //   storeRef.current = store();
  // }

  return (
      <Provider store={storePersistance}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
  )
}