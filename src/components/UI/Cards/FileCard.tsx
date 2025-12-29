"use client";
import styles from "./fileCard.module.css";
import { File } from "@/types"
import {useRouter} from "next/navigation";

// ==============================================

type FileCardProps = {
    file: File;
};

const FileCard = ({ file }: FileCardProps) => {
    const imageExtensions: string[] = ["jpg", "jpeg", "png", "webp", "svg"];
    const router = useRouter();

    return (
        <div className={styles.fileCard}
             onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/files/${file.name}.${file.type}`)}
        >
            {imageExtensions.includes(file.type) && (
                <img src={`/files/${file.name}.${file.type}`}
                     alt="Image of the file"
                />
            )}
            {file.type === "pdf" && (
                <iframe
                    src={`/files/${file.name}.${file.type}`}
                    className={styles.pdfViewer}
                    title={file.name}
                    width="100%"
                />
            )}
            <p>{file.name}.{file.type}</p>
        </div>
    );
};

export default FileCard;
