import md5 from "md5";
import Generator from "generate-password";

export const encrypt = (password: any) => {
  return md5(password);
};

export const generatePassword = () => {
  return Generator.generate({
    length: 10,
    numbers: true,
  });
};
