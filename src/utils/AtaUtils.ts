import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    Account,
    getAccount,
    TokenAccountNotFoundError,
    TokenInvalidAccountOwnerError,
    createAssociatedTokenAccountInstruction,
    mintTo,
} from '@solana/spl-token';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
export const USDC_MINT_ADDRESS = process.env.NEXT_PUBLIC_USDC_MINT_ACCOUNT ?
    new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT_ACCOUNT) :
    new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
//* function to get existing ATA
export const getATA = async (
    walletPublicKey: PublicKey,
    connection: Connection
): Promise<{ account: Account | null; associatedToken: PublicKey }> => {
    // checks
    if (!process.env.NEXT_PUBLIC_MINT_ACCOUNT) {
        throw new Error('Environment variables for mint account are missing');
    }

    // get the token account publickey
    const associatedToken = await getAssociatedTokenAddress(
        new PublicKey(process.env.NEXT_PUBLIC_MINT_ACCOUNT),
        walletPublicKey,
        true,
        TOKEN_PROGRAM_ID, //programId
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // get the user wallet ATA
    let account: Account | null = null;
    try {
        // check is ATA already exist
        account = await getAccount(
            connection, // connection — Connection to use
            associatedToken, // address — Token account
      /*commitment*/ 'single', // commitment — Desired level of commitment for querying the state
            TOKEN_PROGRAM_ID // programId — SPL Token program account
        );
    } catch (error: unknown) {
        console.error('ATA not existing');
    }
    return { account, associatedToken };
};

//* function to get ATA or create is needed
export const getOrCreateATA = async (
    payerPublicKey: PublicKey,
    ownerPublicKey: PublicKey,
    connection: Connection,
    sendTransaction: any,
    MINT_ADDRESS: PublicKey = USDC_MINT_ADDRESS,
) => {
    // checks
    if (!process.env.NEXT_PUBLIC_MINT_ACCOUNT) {
        throw new Error('Environment variables for mint account are missing');
    }

    // get the token account publickey
    const associatedToken = await getAssociatedTokenAddress(
        MINT_ADDRESS,
        ownerPublicKey,
        true,
        TOKEN_PROGRAM_ID, //programId
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // get the user wallet ATA
    let account: Account;
    try {
        // check is ATA already exist
        account = await getAccount(
            connection, // connection — Connection to use
            associatedToken, // address — Token account
      /*commitment*/ 'single', // commitment — Desired level of commitment for querying the state
            TOKEN_PROGRAM_ID // programId — SPL Token program account
        );
    } catch (error: unknown) {
        if (
            // is ATA not existing try to create one
            error instanceof TokenAccountNotFoundError ||
            error instanceof TokenInvalidAccountOwnerError
        ) {
            try {
                const transaction = new Transaction().add(
                    createAssociatedTokenAccountInstruction(
                        payerPublicKey, // payer
                        associatedToken, // associated token
                        ownerPublicKey, // owner
                        MINT_ADDRESS, // token mint account
                        TOKEN_PROGRAM_ID, // programId — SPL Token program account
                        ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId — SPL Associated Token program account
                    )
                );

                // wait for TX confirmation
                const signature = await sendTransaction(transaction, connection);
                await connection.confirmTransaction(signature, 'finalized');
            } catch (error: unknown) {
                /* empty */
            }
            // try again to get the user wallet ATA
            account = await getAccount(
                connection, // connection — Connection to use
                associatedToken, // address — Token account
        /*commitment*/ 'single', // commitment — Desired level of commitment for querying the state
                TOKEN_PROGRAM_ID // programId — SPL Token program account
            );
        } else {
            throw error;
        }
    }

    return { account, associatedToken };
};