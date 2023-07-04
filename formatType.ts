import { ValidationError } from 'https://deno.land/x/cliffy@v0.25.7/flags/_errors.ts';
import { ArgumentValue } from 'https://deno.land/x/cliffy@v0.25.7/flags/types.ts';

const formats = ['flac', 'mp3'];

export const formatType = ({ label, name, value }: ArgumentValue): string => {
	if (!formats.includes(value.toLowerCase()))
		throw new ValidationError(
			`${label} "${name}" must be a valid audio format, but got "${value}". Possible formats are: ${formats.join(
				', '
			)}.`
		);

	return value;
};
