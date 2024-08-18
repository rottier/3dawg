export const getNearestNoteFrequency = (frequency: number): { noteName: string, noteFrequency: number } => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const A4_FREQUENCY = 440;
    
    const n = Math.round(12 * Math.log2(frequency / A4_FREQUENCY));
    const noteIndex = (n + 9) % 12;
    const octave = 4 + Math.floor((n + 9) / 12);
    const noteName = noteNames[noteIndex] + octave;
    const noteFrequency = A4_FREQUENCY * Math.pow(2, n / 12);

    return { noteName, noteFrequency };
}