import React from 'react';
import { useParams } from 'react-router-dom';
import NavigationBar from '../../NavigationBar';
import EquipmentGeneralDetails from './EquipmentGeneralDetails';
import EquipmentProgress from './EquipmentProgress';


export default function EquipmentProfile() {

    const { id } = useParams();

  return (
    <>
    
        <NavigationBar />

        <div className='h-[90vh] overflow-y-auto '>

            <EquipmentGeneralDetails equipmentId={id}/>
            <EquipmentProgress />

        </div>


    </>
  )
}
