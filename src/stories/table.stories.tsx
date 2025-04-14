import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DataTable from '../components/data-table';
import { Column } from 'primereact/column';
import Flag from '../components/tools/flag';
import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
//import { ThemeProvider } from '../theme.new';

const testData = [
    {name: "Amy Elsner", country: 'RU', rating: 4, data:'03-11-2025', image: 'https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg'},
    {name: "John Doe", country: 'US', rating: 5, data:'12-05-2024', image: 'https://randomuser.me/api/portraits/men/1.jpg'},
    {name: "Emma Smith", country: 'UK', rating: 3, data:'07-19-2023', image: 'https://randomuser.me/api/portraits/women/2.jpg'},
    {name: "Carlos Rodríguez", country: 'ES', rating: 4, data:'11-22-2022', image: 'https://randomuser.me/api/portraits/men/3.jpg'},
    {name: "Sofia Müller", country: 'DE', rating: 2, data:'05-14-2021', image: 'https://randomuser.me/api/portraits/women/4.jpg'},
    {name: "Luca Moretti", country: 'IT', rating: 5, data:'09-30-2020', image: 'https://randomuser.me/api/portraits/men/5.jpg'},
    {name: "Isabelle Dubois", country: 'FR', rating: 3, data:'04-10-2019', image: 'https://randomuser.me/api/portraits/women/6.jpg'},
    {name: "Hiroshi Tanaka", country: 'JP', rating: 4, data:'08-27-2025', image: 'https://randomuser.me/api/portraits/men/7.jpg'},
    {name: "Chen Wei", country: 'CN', rating: 5, data:'06-13-2024', image: 'https://randomuser.me/api/portraits/men/8.jpg'},
    {name: "Olga Ivanova", country: 'RU', rating: 2, data:'03-03-2023', image: 'https://randomuser.me/api/portraits/women/9.jpg'},
    {name: "Pedro Gomez", country: 'MX', rating: 3, data:'01-29-2022', image: 'https://randomuser.me/api/portraits/men/10.jpg'},
    {name: "Fatima Al-Farsi", country: 'AE', rating: 4, data:'11-05-2021', image: 'https://randomuser.me/api/portraits/women/11.jpg'},
    {name: "William Johnson", country: 'CA', rating: 5, data:'07-21-2020', image: 'https://randomuser.me/api/portraits/men/12.jpg'},
    {name: "Elena Petrova", country: 'RU', rating: 3, data:'02-14-2019', image: 'https://randomuser.me/api/portraits/women/13.jpg'},
    {name: "Mohammed Hassan", country: 'EG', rating: 2, data:'12-09-2025', image: 'https://randomuser.me/api/portraits/men/14.jpg'},
    {name: "Aisha Khan", country: 'PK', rating: 4, data:'05-18-2024', image: 'https://randomuser.me/api/portraits/women/15.jpg'},
    {name: "Benjamin Andersson", country: 'SE', rating: 5, data:'08-26-2023', image: 'https://randomuser.me/api/portraits/men/16.jpg'},
    {name: "Laura García", country: 'AR', rating: 3, data:'10-31-2022', image: 'https://randomuser.me/api/portraits/women/17.jpg'},
    {name: "Nathan Brown", country: 'AU', rating: 4, data:'06-20-2021', image: 'https://randomuser.me/api/portraits/men/18.jpg'},
    {name: "Mia Nilsson", country: 'NO', rating: 2, data:'03-25-2020', image: 'https://randomuser.me/api/portraits/women/19.jpg'}
];


const meta: Meta<typeof DataTable> = {
    title: 'Table',
    component: DataTable,
    parameters: {
        layout: 'fullscreen', // Растянет компонент на всю область Storybook
    },
    argTypes: {
       
    },
}
export default meta;

const Templates =(args)=> {
    
    return(
        <div style={{ width: '100%', height: '80vh',padding:'5%'}}>
            <DataTable
                virtualScrollerOptions={{ itemSize: 55 }}
                value={testData}
                header={
                    <div>
                        header
                    </div>
                }
                footer={
                    <div>
                        footer
                    </div>
                }
            >
                <Column header="Image" field='image' 
                    body={(data)=> 
                        <Avatar image={data.image}/>
                    }
                />
                <Column header="Name" filter filterPlaceholder="По именам" sortable field='name' />
                <Column header="Rating" sortable field='rating' 
                    body={(data)=> 
                        <Rating cancel={false} value={data.rating} />
                    }
                />
                <Column header="Data" sortable field='data' />
                <Column header="Country" sortable field='country' 
                    body={(data)=> 
                        <Flag code={data.country} />
                    }
                />
            </DataTable>
        </div>
    );
}


type Story = StoryObj<typeof DataTable>;
export const Prime: Story = {
    args: {
        
    },
    render: (props)=> <Templates {...props} />
}