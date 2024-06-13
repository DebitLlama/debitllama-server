import { useState, useEffect } from 'preact/hooks';

export function ChangingTitlePart() {
    const titles = ["for online businesses", "direct debit payments", "gas free txs"];

    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [typingMode, setTypingMode] = useState<"writing" | "deleting" | "waiting">("writing");
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [waitCycles, setWaitCycles] = useState(0)
    const maxWaitCycles = 50;
    const delay = 100;
    useEffect(() => {

        const timeout = setTimeout(() => {

            if (typingMode === "writing") {
                setCurrentText(prevText => prevText + titles[currentTitleIndex][currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
                if (currentIndex == titles[currentTitleIndex].length - 1) {
                    setTypingMode("waiting")
                }
            }

            if (typingMode === "waiting") {
                setWaitCycles(prev => prev + 1)
                if (waitCycles === maxWaitCycles) {
                    setTypingMode("deleting")
                    setWaitCycles(0)
                }
            }


            if (typingMode === "deleting") {
                setCurrentText(prevText => prevText.substring(0, prevText.length - 1))
                if (currentIndex !== 0) {
                    setCurrentIndex(prevIndex => prevIndex - 1)
                } else {
                    setTypingMode("writing")
                    setCurrentTitleIndex(calculateNewTitleIndex(titles, currentTitleIndex))
                }
            }


        }, delay)

        return () => clearTimeout(timeout)

    }, [currentIndex, delay, typingMode, currentTitleIndex, titles])

    return <span>
        {currentText}
    </span>
}

function calculateNewTitleIndex(titlesArr: string[], currentIndex: number) {
    if (currentIndex === 0) {
        return 1;
    }
    if (currentIndex === titlesArr.length - 1) {
        return 0;
    }

    return currentIndex + 1;
}