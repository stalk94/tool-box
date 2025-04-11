import React from "react";
export { TextInput, NumberInput, SliderInput } from '../../input';
import Form from '../../form';
import { listAllComponents, listConfig } from './render';
import { Box } from "@mui/material";



export default function({ type, elem }) {
    const [story, setStory] = React.useState<Record<string, string>[]>([]);
    const [future, setFuture] = React.useState<Record<string, string>[]>([]);
    const [current, setCurrent] = React.useState<Record<string, string>>(null);

    const undo = () => {
        if (story.length <= 1) return; // Nothing to undo
        
        // Take the current state and add it to future for potential redo
        setFuture(prev => [structuredClone(current), ...prev]);
        
        // Get the previous state from story
        const newStory = story.slice(0, -1);
        const previousState = structuredClone(newStory[newStory.length - 1]);
        
        // Update current state and apply it to the theme
        
        
        // Update story array
        setStory(newStory);
    }
    const redo = () => {
        if (future.length === 0) return; // Nothing to redo
        
        // Get the next state from future
        const nextState = structuredClone(future[0]);
        const newFuture = future.slice(1);
        
        // Add current state to history before applying the next state
        setStory(prev => [...prev, structuredClone(current)]);
        
        // Update current state and apply it to the theme
        
        
        // Update future array
        setFuture(newFuture);
    }
    const useAddStory = () => {
        // Only add to story if we have a current state and it's different from the last entry
        if (current && (story.length === 0 || JSON.stringify(current) !== JSON.stringify(story[story.length - 1]))) {
            setStory(prev => [...prev, structuredClone(current)]);
            setFuture([]);
        }
    }
    const useEdit = (key: string, newValue: string) => {
        const copy = structuredClone(current);
        copy[key] = newValue;
        
        // Update current state
        setCurrent(copy);
        onChange(theme);
    }

    React.useEffect(() => {
        console.log('RENDER');

        if(elem) {
            setStory([]);
            setCurrent();
            setFuture([]);
        }
    }, [elem]);


    return(
        <Box sx={{display:'flex', flexDirection: 'column'}} >

        </Box>
    );
}