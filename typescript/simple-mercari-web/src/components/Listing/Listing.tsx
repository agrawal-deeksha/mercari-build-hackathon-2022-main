import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const server = process.env.API_URL || 'http://127.0.0.1:9000';

interface Prop {
	onListingCompleted?: () => void;
}

type formDataType = {
	name: string;
	category: string;
	image: string | File;
};

export const Listing: React.FC<Prop> = (props) => {
	const { onListingCompleted } = props;
	const initialState = {
		name: '',
		category: '',
		image: '',
	};
	const [values, setValues] = useState<formDataType>(initialState);

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};
	const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [event.target.name]: event.target.files![0] });
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData();
		data.append('name', values.name);
		data.append('category', values.category);
		data.append('image', values.image);

		fetch(server.concat('/items'), {
			method: 'POST',
			mode: 'cors',
			body: data,
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('POST success:', data);
				onListingCompleted && onListingCompleted();
				setValues(initialState);
				(document.getElementById('image') as HTMLInputElement).value = '';
			})
			.catch((error) => {
				console.error('POST error:', error);
			});
	};

	const Input = styled('input')({
		display: 'none',
	});

	return (
		<div>
			<Container className='Listing' maxWidth='sm' style={{ alignContent: 'center' }}>
				<Stack spacing={2}>
					<div
						style={{
							maxWidth: '100%',
							textAlign: 'center',
							marginTop: '10%',
						}}
					>
						<p style={{ fontSize: '20px' }}>Sell Products</p>
					</div>
					<form autoComplete='off' onSubmit={onSubmit} className='ListingForm'>
						<Stack className='InputBox' spacing={2}>
							<Box
								component='span'
								sx={{ border: '1px solid red', borderRadius: '5px' }}
							>
								<label htmlFor='image'>
									<Input
										type='file'
										name='image'
										id='image'
										accept='.jpg'
										onChange={onImageChange}
										required
									/>
									<IconButton
										color='error'
										aria-label='upload picture'
										component='span'
									>
										<PhotoCamera />
										<p style={{ fontSize: '16px', marginLeft: '5px' }}>
											Select an image
										</p>
									</IconButton>
								</label>
							</Box>
							<TextField
								required
								color='error'
								label='Product Name'
								name='name'
								id='name'
								placeholder='name'
								value={values.name}
								onChange={onChange}
							/>
							<TextField
								required
								color='error'
								label='Product Category'
								name='category'
								id='category'
								placeholder='category'
								value={values.category}
								onChange={onChange}
							/>

							<div className='SubmitButton'>
								<Button
									type='submit'
									variant='contained'
									color='error'
									size='large'
									style={{ width: '100%' }}
								>
									Sell
								</Button>
							</div>
						</Stack>
					</form>
				</Stack>
			</Container>
		</div>
	);
};
