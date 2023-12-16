import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Link} from 'react-router-dom';


import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
  } from '@mui/material';


  function RepairCard({repair, deviceName}){

    return(
        <Card
          variant='outlined'
          sx={{
            height: 'auto',
            width: 250,
            border: '1px solid #29642b',
          }}
        >
            

              <CardContent>
                <CardActionArea component={Link} to={`/repair/${repair._id}`}>
                <Typography className="deviceName"
                sx={{
                    borderBottom: '1px solid #29642b',
                    fontWeight: 'bold'
                }}
                gutterBottom
                variant='h6'
                component='h3'
                >
                {deviceName ? deviceName : repair.repairStatus}
                </Typography>
                </CardActionArea>

                <Typography className="issue"
                  gutterBottom
                  component='p'
                >
                  Issue: {repair.issue}
                </Typography>

                <Typography className="id"
                  gutterBottom
                  component='p'
                >
                  Device: {repair.deviceID}
                </Typography>

                <Typography 
                  gutterBottom
                  component='p'
                >
                  Work To Do: {repair.workToBeDone}
                </Typography>

                <Typography 
                  gutterBottom
                  component='p'
                >
                  Created Date: {new Date(repair.repairOrderCreationDate).toLocaleString()}
                </Typography>

                {repair.repairCompletionDate ?
                <Typography 
                gutterBottom
                component='p'
              >
                Complted Date: {new Date(repair.repairCompletionDate).toLocaleString()}
                </Typography>:<></>
                }

                {repair.pickupDate ?
                <Typography 
                gutterBottom
                component='p'
              >
                Completed Date: {new Date(repair.pickupDate).toLocaleString()}
                </Typography>:<></>
                }

                <Typography 
                gutterBottom
                component='p'
              >
                Repair ID: {repair._id}
                </Typography>

                
              </CardContent>
        </Card>
    )
}

export default RepairCard