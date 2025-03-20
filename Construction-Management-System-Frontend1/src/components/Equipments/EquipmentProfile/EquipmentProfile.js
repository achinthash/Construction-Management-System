import React from 'react';
import { useParams } from 'react-router-dom';
import NavigationBar from '../../NavigationBar';
import Company_icon from '../../Company_icon';
import EquipmentGeneralDetails from './EquipmentGeneralDetails';
import EquipmentProgress from './EquipmentProgress';


export default function EquipmentProfile() {

    const { id } = useParams();

  return (
    <>
        <Company_icon />
        <NavigationBar />

        <div className='h-[90vh] overflow-y-auto '>

            <EquipmentGeneralDetails equipmentId={id}/>
            <EquipmentProgress />

        </div>


    </>
  )
}
